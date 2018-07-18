module Alpha
  class ContentEntry < ActiveRecord::Base
  include DatabaseConnection
    belongs_to :content_type
    accepts_nested_attributes_for :content_type

    has_one :pin_content_entry, inverse_of: :content_entry
    has_one :pin, through: :pin_content_entry

    has_one :overlay_content_entry
    has_one :overlay, through: :overlay_content_entry

    validates_with Alpha::AnyPresenceValidator, fields: [:attached_file, :video_url, :content, :tileserver_url, :data]
    validates :content_type, presence: true

    serialize :metadata, JSON

    mount_base64_uploader :attached_file, Alpha::AttachedFileUploader
    validate :valid_content_type

    before_save -> {
      self.content = Sanitize.fragment(content)
    }

    def base64_attachment
      raise "Invalid content type" unless attached_file && content_type.name=="text"

      Base64.encode64(open(attached_file.path).read)
    end

    private
    def valid_content_type
      return true unless attached_file && attached_file.present?

      mime_type = `file #{attached_file.path} --mime-type`.split(" ").last
      if File.exists?(attached_file.path) && content_type.mime_type.present? && !content_type.mime_type.split(/,/).any?{|mt| mt.match(/#{mime_type}/)}
        errors.add(:attached_file, "The type of the file you attached (#{mime_type}) isn't a supported #{content_type.name} type.")
      end
    end
  end
end

