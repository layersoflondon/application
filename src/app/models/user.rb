class User < ApplicationRecord

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :invitable

  has_many :records, dependent: :nullify
  update_index('records#record') { records }
  has_many :team_users, dependent: :destroy
  has_many :teams, through: :team_users
  has_many :collections, as: :owner
  has_many :contributed_collection_records, class_name: 'CollectionRecord', foreign_key: :contributing_user_id
  has_many :contributed_collections, through: :contributed_collection_records, class_name: "Collection", source: :collection
  has_one_attached :avatar

  enum role: [:teacher]
  enum title: {mr: "Mr", mrs: "Mrs", ms: "Ms", mx: "Mx", miss: "Miss", dr: "Dr", prof: "Prof", rev: "Rev"}

  serialize :record_likes, Array
  serialize :metadata, Hash

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :terms_and_conditions_of_use, acceptance: {accept: true, message: "need to be accepted"}

  # TODO: - users should change the state of their records before being deleted.
  # before_destroy do
  #  records.each {|r| r.make_orphan! }
  # end
  #


  def name
    "#{first_name} #{last_name}"
  end

  def leading_teams
    Team.includes(:team_users).references(:team_users).where(team_users: {user_id: id, role: "leader", state: 'access_granted'})
    # team_user_leader = TeamUser.where(user_id: self.id, role: 'leader', state: 'access_granted')
    # Team.where(id: team_user_leader.collect{|t| t.team_id})
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
    team_user = TeamUser.invited.find_by(team_id: team.id, key: key)
    if team_user.try(:grant_access!)
      true
    else
      false
    end
  end

  def request_to_join_team!(team)
    # if we're already in team, don't send anything
    unless teams.include?(team)

      # Generate key and add team_user for this user
      key = Devise.friendly_token
      team_users << TeamUser.new(
        team: team,
        role: 'contributor',
        state: 'access_requested',
        key: key
      )

      # Mail the admins with the details of the person who wants to join (this user)
      AccountMailer.team_join_request(self, team, key).deliver_now
    end
  end

  def accept_team_request(team, key)
    team_user = TeamUser.access_requested.find_by(team_id: team.id, key: key)
    if team_user.present? && team_user.grant_access!
      true
    else
      false
    end
  end

  def deny_team_request(team, key)
    team_user = TeamUser.access_requested.find_by(team_id: team.id, key: key)
    if team_user.present? && team_user.deny_access!
      true
    else
      false
    end
  end

  def team_collections_granted
    team_user = TeamUser.where(user_id: id, state: 'access_granted')
    Collection.includes(:records).where(owner_id: team_user.collect(&:team_id), owner_type: 'Team')
  end

  def user_collections
    my_collections = Collection.includes(:records).where(owner_id: id, owner_type: 'User')
  end

  def can_view(collection)
    collection_ids.include? collection.id
  end

  def state_on_team(team)
    team.team_users.find_by(user_id: id).try(:state)
  end

  def avatar_url
    if avatar.attached?
      options = {
        thumbnail: "250x250"
      }
      ApplicationController.helpers.activestorage_url_for(avatar.variant(options))
    end
  end

  def generate_token_with_expiry_date!(expiry_date)
    token = generate_token
    update_attributes(teacher_token: token, teacher_token_expires: expiry_date)
    token
  end

  def invitation_accepted?
    invitation_token.nil? && invitation_accepted_at.present?
  end

  def invitation_pending?
    invitation_token.present? && invitation_accepted_at.nil?
  end

  private
  def generate_token
    token = nil

    loop do
      token = ('a'..'z').to_a.sample(rand(5..6)).join
      break unless self.class.find_by(teacher_token: token)
    end

    token
  end
end
