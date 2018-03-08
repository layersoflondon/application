# frozen_string_literal: true

class Attachment < ApplicationRecord
  has_many :record_attachments
  has_many :records, through: :record_attachments
  validates :attachment_type, :state, :attachment_data, presence: true

  enum attachment_type: %i[video image uri file geojson]
  enum state: %i[published pending uploaded flagged deleted]
end
