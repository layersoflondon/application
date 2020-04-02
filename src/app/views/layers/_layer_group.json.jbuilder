json.id layer_group.id
json.name layer_group.name
json.short_name layer_group.short_name.present? ? layer_group.short_name : strip_tags(layer_group.description).truncate(70)
json.description layer_group.description
json.image layer_group.image
json.slug layer_group.slug
json.highlighted layer_group.highlighted
json.date_from layer_group.date_from

json.layers do
  json.array! layer_group.layers, partial: 'layers/layer', as: :layer
end

if layer_group._explanation.present?
  json.explanation layer_group._explanation
end

