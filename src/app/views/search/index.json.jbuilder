json.array! @results do |result|
  if result.is_a?(RecordsIndex::Record)
      json.partial! 'search/record', record: result
  elsif result.is_a?(CollectionsIndex::Collection)
    json.partial! 'search/collection', locals: {collection: result}
  end

  
end
