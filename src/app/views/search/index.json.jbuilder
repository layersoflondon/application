# TODO - this needs to return an array of both collection search results AND record search results
json.array! @results do |result|
  if result.is_a?(RecordsIndex::Record)
      json.partial! 'search/record', record: result
  elsif result.is_a?(CollectionsIndex::Collection)
    json.partial! 'search/collection', locals: {collection: result}
  end

  
end
