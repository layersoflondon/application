module UserGroupStates
  def current
    invitations("accepted")
  end

  def invitations(invitation_state = ["invited", "requested"])
    where({user_group_users: {invitation_state: invitation_state}})
  end

  def group_invitation(group)
    where({user_group_users: {invitation_state: "invited", user_group_id: group.id}}).first
  end

  def primary_user
    where("user_groups.primary_user_id <=> user_group_users.user_id")
  end

  def primary_user_with_pending_requests
    where("user_groups.primary_user_id <=> user_group_users.user_id").where({user_group_users: {invitation_state: "requested"}})
  end
end