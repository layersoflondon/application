class User < ApplicationRecord

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :invitable

  has_many :records, dependent: :nullify
  update_index('records#record') { records }
  has_many :team_users
  has_many :teams, through: :team_users
  has_many :collections, as: :owner
  has_one_attached :avatar

  serialize :record_likes, Array

  # TODO: - users should change the state of their records before being deleted.
  # before_destroy do
  #  records.each {|r| r.make_orphan! }
  # end
  #


  def name
    "#{first_name} #{last_name}"
  end
  def leading_teams
    team_user_leader = TeamUser.where(user_id: self.id, role: 'leader', state: 'access_granted')
    Team.where(id: team_user_leader.collect{|t| t.team_id})
  end

  def contributing_teams
    team_user_contributor = TeamUser.where(user_id: self.id, role: 'contributor', state: 'access_granted')
    Team.where(id: team_user_contributor.collect{|t| t.team_id})
  end


  def create_team(team)
    team_users << TeamUser.new(
      team: team,
      role: 'leader',
      state: 'access_granted'
    )
    team.save
  end

  def accept_team_invitation(team, key)
    team_user = TeamUser.find_by(team_id: team.id, key: key, state: 'invited')
    if team_user&.mark_as_access_granted
      team_user.key = nil
      return team_user.save
    end
    false
  end

  def request_join_team(team)
    unless team_users.find_by(team_id: team.id)
      key = Devise.friendly_token
      team_users << TeamUser.new(
        team: team,
        role: 'contributor',
        state: 'access_requested',
        key: key
      )
      AccountMailer.team_join_request(self, team, key).deliver_now
    end
  end

  def accept_team_request(team, key)
    team_user = TeamUser.find_by(team_id: team.id, key: key, state: 'access_requested')
    if team_user&.mark_as_access_granted
      team_user.key = nil
      return team_user.save
    end
    false
  end

  def deny_team_request(team, key)
    team_user = TeamUser.find_by(team_id: team.id, key: key, state: 'access_requested')
    if team_user&.mark_as_access_denied
      team_user.key = nil
      return team_user.save
    end
    false
  end

  def team_collections_granted
    team_user = TeamUser.where(user_id: id, state: 'access_granted')
    Collection.includes(:records).where(owner_id: team_user.collect(&:id), owner_type: 'Team')
  end

  def collections
    my_collections = Collection.where(owner_id: id, owner_type: 'User')
    collections_granted = self.team_collections_granted
    Collection.includes(:owner, :records).where(id: (my_collections.ids + collections_granted.ids).uniq)
  end

  def can_view(collection)
    collection_ids.include? collection.id
  end

end
