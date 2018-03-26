class Team < ApplicationRecord
  has_many :user_teams
  has_many :users, through: :user_teams
  # TODO: add a before_validation hook to add the owner of the team based on the current_user who created it.
  validates :name, presence: true
end
