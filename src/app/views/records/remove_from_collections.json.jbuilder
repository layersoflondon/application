json.collection_ids do
  json.array! @result.collection_ids
end
json.collections do
  json.array! @result.collections.collect {|c| OpenStruct.new(c)}, partial: 'search/collection_summary', as: :collection
end
