class Attachment < ApplicationRecord
  belongs_to :attachable, polymorphic: true
  attr_writer :attachment_type

  delegate :title, :caption, :credit, :url, :file, to: :attachable

  accepts_nested_attributes_for :attachable

  def build_attachable(params)
    self.attachable = "Attachments::#{@attachment_type.classify}".constantize.new(params)
  end

  def has_file?
    attachable.respond_to?(:file)
  end

  def has_url?
    attachable.respond_to?(:url)
  end

end





