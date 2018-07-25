class CustomDeviseMailerPreview < ActionMailer::Preview

  def confirmation_instructions
    CustomDeviseMailer.confirmation_instructions(User.first, "faketoken", {})
  end

  def reset_password_instructions
    CustomDeviseMailer.reset_password_instructions(User.first, "faketoken", {})
  end

  def unlock_instructions
    CustomDeviseMailer.unlock_instructions(User.first, "faketoken", {})
  end

  def invitation_instructions
    CustomDeviseMailer.invitation_instructions(User.first, "faketoken", {})
  end
end