json.id layer_category.id
json.name layer_category.name

json.layer_terms do
  json.array! layer_category.layer_terms, partial: 'layer_categories/layer_term', as: :layer_term
end
