json.id collection.id
json.title collection.title
json.description collection.description
json.date_from collection.date_from
# json.date_to collection.date_to
json.created_at DateTime.parse(collection.created_at).strftime("%d/%m/%Y")
json.updated_at DateTime.parse(collection.updated_at).strftime("%d/%m/%Y")
json.owner collection.owner
json.records do
  json.array! collection.records.collect {|r| OpenStruct.new(r)}, partial: 'search/record', as: :record
end
json.image collection.image