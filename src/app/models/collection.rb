class Collection < ApplicationRecord
  has_many :collection_records, dependent: :destroy
  has_many :records, through: :collection_records
  update_index('records#record') { records }
  update_index('collections#collection') {self}
  belongs_to :owner, polymorphic: true

  # TODO: permissions for reading and writing should go in a Pundit policy (see https://github.com/varvet/pundit).
  # I think we still need these enums though.
  enum read_state: {
    public_read: 0,
    private_read: 1
  }
  enum write_state: {
    creator: 0,
    team: 1,
    everyone: 2
  }

  validates :title, :description, presence: true
  validates :title, length: { in: 3..255 }
  validates :description, length: { minimum: 3 }
  validate :write_state_team, if: -> {write_state === 'team'}

  scope :collections_for_user, ->(user) {
    if user && user.is_a?(User)
      where(read_state: :public_read).or(Collection.where(read_state: :private_read, owner_id: user.id))
    else
      where(read_state: [:public_read])
    end
  }

  def primary_image
    record_with_primary_image = records.where.not(primary_image_id: nil).try(:first)
    return record_with_primary_image.get_primary_image if record_with_primary_image

    # get any records in this collection that have attached images
    records_with_images = records.includes(attachments: :attachable).joins(:attachments).where(attachments: {attachable_type: "Attachments::Image"}).compact
    return nil unless records_with_images.any?

    record_images = records_with_images.collect{|r| r.attachments.where(attachable_type: "Attachments::Image")}.flatten
    record_images.find{|i| i.attachable.primary} || record_images.first
  end

  def write_state_team
    if team? && owner_id == nil
      errors.add(:write_state, 'team not provided')
    end

    if team? && !(owner.present? || owner.is_a?(Team))
      errors.add(:write_state, 'team does not exists')
    end
  end

end
