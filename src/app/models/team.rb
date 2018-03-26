class Team < ApplicationRecord
  has_many :team_users
  has_many :users, through: :team_users, dependent: :delete_all
  # TODO: add a before_validation hook to add the owner of the team based on the current_user who created it.
  validates :name, presence: true
end
