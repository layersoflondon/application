class Team < ApplicationRecord
  validates :name, :team_type, presence:true
end
