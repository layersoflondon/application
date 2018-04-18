json.id record.id
json.title record.title
json.description record.description
json.like_count record.like_count
json.view_count record.view_count
json.state record.state
json.lat record.lat
json.lng record.lng
json.date record.date
# TODO: change to use json builder user partial
json.merge! user: {
    id: record.user.id,
    name: record.user.email
}
json.created_at record.created_at
json.location record.location
json.collections do
  json.array! record.collections, partial: 'records/record_collections', as: :collection
end

json.attachments do
  json.array! record.attachments, partial: 'record_attachments/attachment', as: :attachment
end