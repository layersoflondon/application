json.id record.id
json.title record.title
json.description record.description
json.like_count record.like_count
json.view_count record.view_count
json.state record.state
json.lat record.lat
json.lng record.lng
json.date_from record.date_from
json.date_to record.date_to
# TODO: change to use json builder user partial
json.merge! user: {
    id: record.user.id,
    name: record.user.email
}
json.attachments do
  json.array! record.attachments do |attachment|
    json.url "http://placehold.it/900x400s"
    json.attachment_type "image"
    json.title attachment.attachable.title
    json.description attachment.attachable.description if attachment.attachable.respond_to?(:description)
    json.caption attachment.attachable.caption
  end
end
json.created_at record.created_at
json.location record.location
json.collections do
  json.array! record.collections, partial: 'records/record_collections', as: :collection
end

json.attachments do
  json.array! record.attachments, partial: 'record_attachments/attachment', as: :attachment
end