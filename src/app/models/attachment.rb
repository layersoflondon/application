class Attachment < ApplicationRecord
  belongs_to :record
  belongs_to :attachable, polymorphic: true, dependent: :destroy
  # update_index('attachments#attachment') { self }
  after_save do
    record.touch
  end
  
  after_destroy do
    record.touch
  end
  attr_writer :attachment_type
  delegate :title, :caption, :credit, to: :attachable
  accepts_nested_attributes_for :attachable
  validates_associated :attachable

  scope :url, -> {
    with_attachable_type('Attachments::Url')
  }

  scope :image, -> {
    with_attachable_type('Attachments::Image')
  }

  scope :audio_file, -> {
    with_attachable_type('Attachments::AudioFile')
  }

  scope :dataset, -> {
    with_attachable_type('Attachments::Dataset')
  }

  scope :document, -> {
    with_attachable_type('Attachments::Document')
  }

  scope :video, -> {
    with_attachable_type('Attachments::Video')
  }

  scope :geodata, -> {
    with_attachable_type('Attachments::Geodata')
  }

  scope :text, -> {
    with_attachable_type('Attachments::Text')
  }

  scope :with_attachable_type, ->(type) {
    where(attachable_type: type)
  }

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

  def is_primary?
    has_image? ? attachable.primary : false
  end

  
end
