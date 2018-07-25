class TeamsController < ApplicationController
  layout 'iframe'

  before_action :get_team, except: [:index, :create, :request_to_join]
  before_action :get_team_user, except: [:index, :create, :remove, :request_to_join]
  before_action :get_teams, only: [:index, :create]


  def index
    authorize @teams
    @other_teams = Team.where.not(id: current_user.teams.collect(&:id))
    respond_to do |format|
      format.json
      format.html
    end
  end

  def show
    authorize @team
    respond_to do |format|
      format.json
      format.html
    end
  end

  def create
    # Create a new team. current_user will be the leader.
    @team = Team.new(team_params)
    @team.team_users.build(user: current_user, state: :access_granted, role: :leader)
    authorize(@team)
    if @team.save
      redirect_to team_path(@team), flash: {success: "Your new team has been created"}
    else
      get_teams
      render :index, flash: {error: "Your team couldn't be saved"}
    end

  end

  def update
    # Update details for a current team. TODO
    
  end

  def destroy
    # Delete. Only if current_user is a leader.
    authorize(@team)
    if @team.destroy
      flash[:success] = "The #{@team.name} team was deleted"
    else
      flash[:error] = "There was a problem deleting the #{@team.name} team"
    end
    redirect_to teams_path
  end

  def request_to_join
    # Create team_user record for team and current_user
    @team = Team.find(params[:team_id])
    authorize(@team)
    if current_user.request_to_join_team!(@team)
      flash[:success] = "Your request to join the #{@team.name} team has been sent."
    else
      flash[:error] = "Something went wrong when requesting to join the #{@team.name} team"
    end

    redirect_to teams_path
  end

  def accept_request
    # token-authenticated method from leader's email
    authorize(@team)
    if current_user.accept_team_request(@team, params[:key])
      flash[:success] = "Request to join the #{@team.name} team has been accepted"
    else
      flash[:error] = "Something went wrong while accepting the request. Have you already accepted it?"
    end
    redirect_to team_path(@team)
  end

  def deny_request
    # token-authenticated method from leader's email
    # the team_user record should be removed (otherwise they'll never be able to apply again)
    authorize(@team)
    if current_user.deny_team_request(@team, params[:key])
      flash[:success] = "The request was denied. If this was a mistake, you can invite the user again."
    else
      flash[:error] = "Something went wrong while denying the request."
    end
    redirect_to team_path(@team)
  end

  def invite_users
    authorize @team
    # Invite new user with invite!() or send email to existing user.
    # In either case, add team_user record
    emails = params[:emails].split(",").collect(&:strip).select {|e| e.match(Devise.email_regexp)}

    if emails.any?
      # get existing users
      existing_users = User.where(email: emails)
      # get emails of new users
      new_user_emails = emails - existing_users.collect(&:email) #gives an array of nonexistent users
      # for existing users, send a team invitations (already working?)
      existing_users.each do |user|
        @team.invite!(current_user, user)
      end
      # for new users, send them a devise invitation and automatically add them to the team
      new_user_emails.each do |email|
        user_invited = User.invite!(email: email)
        @team.team_users << TeamUser.new(
            user: user_invited,
            role: 'contributor',
            state: 'access_granted'
        )
      end
      redirect_to team_path(@team.id), flash: {success: "Your email invitations were sent"}
    else
      redirect_to team_path(@team.id), flash: {error: "You didn't include any valid email addresses"}
    end
  end

  def accept_invitation
    # token-authenticated method from user's email.
    authorize(@team)
    if current_user.accept_team_invitation(@team, params[:key])
      redirect_to team_path(@team), flash: {success: "You've been added to the #{@team.name} team"}
    else
      redirect_to teams_path, flash: {error: "Something went wrong accepting your invitation"}
    end
  end

  def leave
    # Any user in the team should be able to do this
    authorize(@team)
    if @team_user.destroy
      redirect_to teams_path, flash: {success: "You have left the #{@team.name} team"}
    else
      render :show, flash: { error: "There was a problem leaving this team"}
    end

  end

  def remove
    authorize(@team)
    user = User.find(params[:user_id])
    if @team.team_users.find_by(user_id: user.id).delete
      flash[:success] = "#{user.name} has been removed from the team"
    else
      flash[:error] = "There was a problem removing #{user.name} from the team"
    end
    redirect_to team_path(@team)
  end
 
  private

  def get_team
    @team = Team.find(params[:id])
  end

  def get_team_user
    @team_user = @team.team_users.find_by(user_id: current_user.id)
  end

  def get_teams
    @teams = policy_scope(Team)
  end

  def team_params
    params.require(:team).permit(
      :name,
      :description,
      :query
    )
  end
end
