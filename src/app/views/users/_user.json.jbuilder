json.id user.id
json.name user.name
json.description strip_tags(user.description)
json.avatar_url user.avatar_url
if defined?(records)
  json.records do
    json.array! records do |record|
      json.partial! 'search/record', record: record
    end
  end
end
