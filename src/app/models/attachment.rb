class Attachment < ApplicationRecord
  has_many :records
  belongs_to :attachable, polymorphic: true
  update_index('attachments#attachment') { self }
  update_index 'records#record' do
    previous_changes['record_id'] || record
  end
  attr_writer :attachment_type
  # TODO: not sure whether url and file methods should be included in attachable, for instance
  # when deleting an url, gives the error: undefined method `file' for <Attachment ..
  delegate :title, :caption, :credit, to: :attachable
  accepts_nested_attributes_for :attachable
  validates_associated :attachable

  def build_attachable(params)
    self.attachable = "Attachments::#{@attachment_type.classify}".constantize.new(params)
  end

  def has_file?
    attachable.respond_to?(:file)
  end

  def has_url?
    attachable.respond_to?(:url)
  end

  def file
    has_file? ? attachable.file : nil
  end

  def url
    has_url? ? attachable.url : nil
  end

  def has_image?
    attachable_type ==  "Attachments::Image"
  end

  def is_primary
    has_image? ? attachable.primary : nil
  end
end
