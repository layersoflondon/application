json.id user.id
json.name user.name
json.description simple_format(strip_tags(user.description))
json.avatar_url user.avatar_url
json.records records.collect do |record|
    json.partial! 'search/record', record: record
end


