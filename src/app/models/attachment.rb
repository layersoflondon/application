class Attachment < ApplicationRecord
  has_many :record_attachments
  has_many :records, through: :record_attachments
  validates :attachment_type, :state, :attachment_data, presence:true
  enum attachment_type: [ :video, :image, :uri, :file, :geojson ]
end
