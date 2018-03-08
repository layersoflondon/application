json.id collection.id
json.title collection.title
json.description collection.description
json.attachment_id collection.attachment_id
json.read_state collection.read_state
json.write_state collection.write_state
json.records do
  json.array! collection.records, partial: 'records/record',  as: :record
end
