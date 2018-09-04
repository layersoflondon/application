json.id team.id
json.name team.name
json.description team.description
json.records do
  json.array! team.collections.collect {|r| OpenStruct.new(r)}.select {|r| RecordPolicy.new(current_user, r).show?}, partial: 'search/collection', as: :collection
end
