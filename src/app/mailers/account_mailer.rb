class AccountMailer < ApplicationMailer

  def team_join_request(user, team, key)
    @user = user
    @team = team
    @url_accept = url_for(controller: 'teams', action: 'accept_request', id: @team.id, key: key)
    @url_deny = url_for(controller: 'teams', action: 'deny_request', id: @team.id, key: key)
    mail(to: @user.email, subject: 'Layers of London - Request to join a team')
  end

  def team_invite_request(user, user_invited, team, key)
    @user = user
    @user_invited = user_invited
    @team = team
    @url_accept = url_for(controller: 'teams', action: 'accept_invitation', id: @team.id, key: key)
    mail(to: @user_invited.email, subject: 'Layers of London - Invitation to join a team')
  end
end
