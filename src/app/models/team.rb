class Team < ApplicationRecord

  has_many :team_users, dependent: :destroy
  has_many :leader_users, -> {leader}, class_name: "TeamUser"
  has_many :contributor_users, -> {contributor}, class_name: "TeamUser"
  has_many :leaders, through: :leader_users, source: :user
  has_many :contributors, through: :contributor_users, source: :user
  has_many :users, through: :team_users
  has_many :collections, as: :owner, dependent: :destroy

  update_index('collections#collection') {self.collections}

  # TODO: add a before_validation hook to add the owner of the team based on the current_user who created it.
  validates :name, presence: true

  def owned_by?(user)
    leaders.include?(user)
  end

  def invite!(user, user_invited)
    team_user = team_users.find_or_create_by(user_id: user_invited.id)
    unless team_user.invited?
      key = Devise.friendly_token
      team_user.update_attributes(
        role: 'contributor',
        state: 'invited',
        key: key
      )
    end

    AccountMailer.team_invite_request(user, user_invited, self, key).deliver_now
  end

  def role_for_user(user)
    team_users.find_by(user_id: user).try(:role)
  end


end
