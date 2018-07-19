class Team < ApplicationRecord

  has_many :team_users
  has_many :leader_users, -> {leader}, class_name: "TeamUser"
  has_many :contributor_users, -> {contributor}, class_name: "TeamUser"
  has_many :leaders, through: :leader_users, source: :user
  has_many :contributors, through: :contributor_users, source: :user
  has_many :users, through: :team_users, dependent: :delete_all
  has_many :collections, as: :owner

  # TODO: add a before_validation hook to add the owner of the team based on the current_user who created it.
  validates :name, presence: true

  def members
    team_users.order(:role).includes(:user)
  end

  def is_owner(user)
    user_found = team_users.find_by(user_id: user.id)
    return user_found.role == 'leader' if user_found
    false
  end

  def invite(user, user_invited)
    unless team_users.find_by(user_id: user_invited.id)
      key = Devise.friendly_token
      team_users << TeamUser.new(
        user: user_invited,
        role: 'contributor',
        state: 'invited',
        key: key
      )
      AccountMailer.team_invite_request(user, user_invited, self, key).deliver_now
    end
  end
end
