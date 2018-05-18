json.id collection.id
json.title collection.title
json.description collection.description
json.attachment_id collection.attachment_id
json.read_state collection.read_state
json.write_state collection.write_state

json.image do
  json.partial! 'record_attachments/attachment', attachment: collection.primary_image
end

if collection.owner_type == 'User'
  json.owner do
    json.type 'User'
    json.id collection.owner.id
    json.email collection.owner.email
  end
elsif collection.owner_type == 'Team'
  json.owner do
    json.type 'Team'
    json.id collection.owner.id
    json.name collection.owner.name
  end
end

json.records do
  json.array! collection.records, partial: 'records/record', as: :record
end


