json.id collection.id
json.title collection.title
json.image collection.image
json.user_can_remove_from (current_user.present? && collection.contributing_user_id == current_user.id)
json.user_is_owner (current_user.present? && collection.owner_type == "User" && collection.owner_id == current_user.id)