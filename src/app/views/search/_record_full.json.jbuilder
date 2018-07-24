json.credit record.credit
json.like_count record.like_count
json.view_count record.view_count
json.state record.state
json.location record.location
json.date_from record.date_from
json.date_to record.date_to
json.created_at DateTime.parse(record.created_at).strftime("%d/%m/%Y")
json.updated_at DateTime.parse(record.updated_at).strftime("%d/%m/%Y")
json.user record.user
json.collections record.collections
json.attachments record.attachments
json.user_can_edit RecordPolicy.new(current_user,record).edit?
json.user_can_like RecordPolicy.new(current_user,record).like?
if record.image
  json.image record.image.select {|k,v| k.in?(['thumb','primary', 'large'])}
else
  json.image nil
end
json.taxonomy_terms record.taxonomy_terms
json.view_type record.view_type