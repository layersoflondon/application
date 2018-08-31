json.score collection._score
json.id collection.id
json.title collection.title
json.description collection.description
json.excerpt strip_tags(collection.description).truncate(80)
json.read_state collection.read_state
json.write_state collection.write_state
json.date_from collection.date_from
# json.date_to collection.date_to
json.created_at DateTime.parse(collection.created_at).strftime("%d/%m/%Y")
json.updated_at DateTime.parse(collection.updated_at).strftime("%d/%m/%Y")
json.owner collection.owner
json.contributor_ids collection.contributor_ids
json.records do
  json.array! collection.records.collect {|r| OpenStruct.new(r)}.select {|r| RecordPolicy.new(current_user, r).show?}, partial: 'search/record', as: :record
end
json.image collection.image
json.user_can_edit CollectionPolicy.new(current_user,collection).edit?