json.id project.id
json.name project.name
json.description project.description
json.georeferencer_id project.georeferencer_id
json.centroid project.centroid
json.images do
  json.array! @images, partial: 'georeferencer_projects/image', as: :image
end
