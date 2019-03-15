class Georeferencer::Project < ApplicationRecord
  include FriendlyId

  friendly_id :name
end
