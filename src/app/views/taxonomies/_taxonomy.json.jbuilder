json.id taxonomy.id
json.name taxonomy.name
json.description taxonomy.description
json.taxonomy_terms do
  json.array! taxonomy.taxonomy_terms, partial: 'taxonomy_terms/taxonomy_term', as: :taxonomy_term
end
