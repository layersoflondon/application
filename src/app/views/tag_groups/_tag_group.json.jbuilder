json.id   tag_group.id
json.name tag_group.name
json.slug tag_group.slug

json.set! :tags do
  json.array! tag_group.tags do |tag|
    json.id   tag['id']
    json.tag_group_id tag['tag_group_id']
    json.name tag['name']
    json.slug tag['slug']
  end
end
