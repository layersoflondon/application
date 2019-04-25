json.id layer_group.id
json.name layer_group.name
json.description layer_group.description
json.image layer_group.image
json.slug layer_group.slug

json.layers do
  json.array! layer_group.layers, partial: 'layers/layer', as: :layer
end
