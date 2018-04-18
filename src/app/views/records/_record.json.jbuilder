json.id record.id
json.title record.title
json.description record.description
json.like_count record.like_count
json.view_count record.view_count
json.state record.state
json.deleted record.deleted
json.lat record.lat
json.lng record.lng
json.date record.date
json.primary_image record.primary_image
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
