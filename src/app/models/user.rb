class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :records, dependent: :nullify
  has_many :team_users
  has_many :teams, through: :team_users
  has_many :collections, as: :owner
  has_one_attached :avatar

  # TODO: - users should change the state of their records before being deleted.
  # before_destroy do
  #  records.each {|r| r.make_orphan! }
  # end

  def create_team(team)
    team_users << TeamUser.new(
      team: team,
      role: 'leader',
      state: 'access_granted'
    )
    team.save
  end

  def request_join_team(team)
    unless team_users.find_by(team_id: team.id)
      team_users << TeamUser.new(
        team: team,
        role: 'contributor',
        state: 'access_requested'
      )
    end
  end

  def team_collections_granted
    team_user = TeamUser.where(user_id: self.id, state: 'access_granted')
    Collection.where(owner_id: team_user.collect{|tu| tu.id}, owner_type: 'Team')
  end
end
