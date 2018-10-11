json.credit record.credit
json.like_count record.like_count
json.view_count record.view_count
json.state record.state
json.location record.location
json.date_from record.date_from
json.date_to record.date_to
json.created_at DateTime.parse(record.created_at).strftime("%d/%m/%Y")
json.updated_at DateTime.parse(record.updated_at).strftime("%d/%m/%Y")

json.added_by_student record.added_by_student
json.user do
  json.id record.user['id']
  json.name record.user['name']
  json.student_name record.student_details if record.added_by_student
  json.description record.user['description']
  json.avatar_url record.user['avatar_url']
  json.contact_me record.user['contact_me']
end

json.collection_ids do
  json.array! record.collections.collect {|r| OpenStruct.new(r)}.select {|r| r.read_state == 'public_read' || (current_user.present? && r.read_state == 'private_read' && r.owner_type == "User" && r.owner_id == current_user.id)}.collect(&:id)
end

json.collections do
  json.array! record.collections.collect {|r| OpenStruct.new(r)}.select {|r| r.read_state == 'public_read' || (current_user.present? && r.read_state == 'private_read' && r.owner_type == "User" && r.owner_id == current_user.id)}, partial: 'search/collection_summary', as: :collection
end
json.attachments record.attachments
json.user_can_edit RecordPolicy.new(current_user,record).edit?
json.user_can_like RecordPolicy.new(current_user,record).like?
if record.image
  json.image record.image.select {|k,v| k.in?(['card', 'thumb','primary', 'large'])}
else
  json.image nil
end
json.taxonomy_terms record.taxonomy_terms
json.view_type record.view_type
json.user_can_publish session[:teacher_classroom_user].nil?
