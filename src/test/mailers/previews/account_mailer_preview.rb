# Preview all emails at http://localhost:3000/rails/mailers/account_mailer
class AccountMailerPreview < ActionMailer::Preview
  def team_join_request
    AccountMailer.team_join_request(User.first, Team.first, key: "foo")
  end

  def team_invite_request
    AccountMailer.team_invite_request(User.first, User.second, Team.first, key: "foo")
  end
end
