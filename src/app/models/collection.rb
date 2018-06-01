class Collection < ApplicationRecord
  has_many :collection_records
  has_many :records, through: :collection_records, dependent: :destroy
  update_index('records#record') { records }
  belongs_to :owner, polymorphic: true

  # TODO: permissions for reading and writing should go in a Pundit policy (see https://github.com/varvet/pundit).
  # I think we still need these enums though.
  enum read_state: %i[public_read private_read]
  enum write_state: %i[everyone team creator]

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
    # gety any records in this collection that have attached images
    records_with_images = records.includes(attachments: :attachable).joins(:attachments).where(attachments: {attachable_type: "Attachments::Image"})
    return nil unless records_with_images.any?

    # collect each records' primary image
    first_primary_images_from_records = records_with_images.collect do |rec|
      attachables = rec.attachments.where(attachable_type: "Attachments::Image").collect(&:attachable)
      attachables.find{|att| att.primary == true}
    end

    # return the first primary image attachment, or just the first image if none are set as primary_image
    first_primary_images_from_records.try(:first) || records_with_images.first.attachments.first
  end

  def write_state_team
    if team? && write_state_team_id == nil
      errors.add(:write_state, 'write_state_team_id value not provided')
    end

    if team? && write_state_team_id > 0
      unless Team.find_by_id(write_state_team_id)
        errors.add(:write_state, 'team does not exists')
      end
    end

    if write_state_team_id != nil &&  (creator? || everyone?)
      self.write_state_team_id = nil
    end
  end

end
