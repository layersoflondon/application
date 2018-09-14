json.id collection.id
json.title collection.title
json.thumb collection.thumb
json.user_can_remove (collection.contributing_user_id == current_user.id)
json.user_is_owner (collection.owner_type == "User" && collection.owner_id == current_user.id)