class TeamUser < ApplicationRecord
  belongs_to :team
  belongs_to :user

  enum role: %i[leader contributor]
end
