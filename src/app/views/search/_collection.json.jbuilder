json.score collection._score
json.id collection.id
json.title collection.title
json.description collection.description || ""
json.excerpt strip_tags(collection.description).try(:truncate,80) || ""
json.read_state collection.read_state
json.write_state collection.write_state
json.write_state_team_id collection.write_state_team_id
json.date_from collection.date_from
# json.date_to collection.date_to
json.created_at DateTime.parse(collection.created_at).strftime("%d/%m/%Y")
json.updated_at DateTime.parse(collection.updated_at).strftime("%d/%m/%Y")
json.owner collection.owner
json.contributor_ids collection.contributor_ids
# json.records do
#   json.array! collection.records.collect {|r| OpenStruct.new(r)}.select {|r| RecordPolicy.new(current_user, r).show?}, partial: 'search/record', as: :record
# end
json.records do 
  json.array!(collection.records.select{|r| RecordPolicy.new(current_user, OpenStruct.new(r)).show?}) do |record|
    json.id record['id']
    json.title record['title']
    json.description record['description']
    json.excerpt record['excerpt']
    json.lat record['pin']['lat']
    json.lng record['pin']['lon']
    json.state record['state']
    json.collection_ids record['collection_ids'].try(:uniq)
    json.tag_groups record['tag_groups']
    json.tag_ids record['tag_ids']
    json.image do 
      json.card record.try(:[], 'image').try(:[], 'card')
    end
  end
end

json.image collection.image
json.user_can_edit user_signed_in? ? CollectionPolicy.new(current_user,collection).edit? : false