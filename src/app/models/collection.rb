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

    # TODO: change me for active record association
    raw_sql = '
      SELECT a.id
      FROM attachments a
      JOIN attachments_images ai ON ai.id = a.attachable_id
      WHERE a.attachable_type = "Attachments::Image"
      AND a.record_id IN
      (
        SELECT * FROM
        (
          SELECT cr.record_id FROM collections c
          JOIN collection_records cr ON cr.collection_id = c.id
          WHERE c.id = ?
              GROUP BY (cr.record_id)
          ) AS subquery
      )
      ORDER BY ai.primary DESC
      LIMIT 1
    '
    sql = ActiveRecord::Base.send(:sanitize_sql_array, [raw_sql, self.id])

    attachment_id = nil
    rows_array = ActiveRecord::Base.connection.execute(sql)
    rows_array.each do |row|
      attachment_id = row[0]
    end
    return Attachment.find(attachment_id) if attachment_id
    nil

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
