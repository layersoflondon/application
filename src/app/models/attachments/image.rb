class Attachments::Image < ApplicationRecord
  include Attachments::SharedValidations
  include Attachments::AttachedFile
  has_one :attachment, as: :attachable

  validate :validate_image_file

  after_save :set_as_only_primary!, if: -> {self.primary?}
  after_save :generate_variants

  # set any sibling images primary attribute to false, set the associated
  # record's primary_image_id, and set this image as the only primary one
  def set_as_only_primary!
    self.primary = true
    self.primary_will_change!
    associated_images = attachment.record.attachments.includes(:attachable).where(attachable_type: "Attachments::Image").where.not(attachable_id: self.id)
    associated_images.select{|i| i.attachable.primary}.map{|i| i.attachable.update_attribute(:primary, false)}
    attachment.record.update_attribute(:primary_image_id, self.id)
  end

  # Used for indexing into ES. In the case of an image, we want to index the variants as well as the main url for the image
  # LoL are concerned about unattributed copying, so we will not expose the original, but instead
  def data
    super.merge(
           Rails.configuration.x.image_variants.inject({}) do |hash, (name, configuration)|
             hash[name] = ApplicationController.helpers.activestorage_url_for(file.variant(configuration))
             hash
           end
    )
  end

  private
  def validate_image_file
    # errors.add(:attachment, 'File is not image') unless file.try(:image?)
  end

  def generate_variants
   Rails.configuration.x.image_variants.each do |name, configuration|
      file.variant(configuration).processed
    end
  end
end
