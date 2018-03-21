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
json.collections do
  json.array! record.collections, partial: 'records/record_collections', as: :collection
end
