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
json.created_at record.created_at
json.location record.location

json.user_can_edit policy(record).edit?
json.user_can_like policy(record).like?

json.view_type record.view_type

# TODO: change to use json builder user partial
json.user do
    json.id record.user.id
    json.name record.user.email
end

json.collections do
  json.array! record.collections, partial: 'records/record_collections', as: :collection
end

json.image do
  json.partial! 'record_attachments/attachment', attachment: record.get_primary_image(fallback_to_first: true)
end

json.attachments do
  json.array! record.attachments, partial: 'record_attachments/attachment', as: :attachment
end

json.taxonomy_terms do
  json.array! record.taxonomy_terms, partial: 'taxonomy_terms/taxonomy_term', as: :taxonomy_term
end
