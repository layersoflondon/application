json.id layer.id
json.name layer.name
json.short_name layer.short_name.present? ? layer.short_name : strip_tags(layer.description).truncate(70)
json.description layer.description
json.slug layer.slug
# json.credit layer.credit
# json.date layer.date_from
# json.url layer.layer_data["url"]
json.image layer.image
json.opacity 1
json.enabled false
json.highlighted layer.highlighted

json.layers do
  json.array! layer.layers, partial: 'layers/layer', as: :layer
end