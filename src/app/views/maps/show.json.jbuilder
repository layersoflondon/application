json.set! :records do
  json.array! @data.select{|r| r.is_a?(Record)} do |record|
    json.partial! 'records/record', record: record
  end
end

json.set! :collections do
  json.array! @data.select{|r| r.is_a?(Collection)} do |collection|
    json.partial! 'collections/collection', {locals: {collection: collection}}
  end
end
