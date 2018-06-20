if @collection
  json.partial! 'maps/partials/collection_state', {locals: {collection: @collection, records: @records, collections: @collections}}
else
  json.partial! 'maps/partials/record_state', {locals: {records: @records, collections: @collections}}
end

json.set! :recordFormStore do
end

json.layersStore({})
json.set! :layersStore do
  json.set! :layers, @layers.collect do |layer|
    json.partial! 'maps/partials/layer_state', layer: layer
  end
end

json.mapViewStore({})
json.set! :mapViewStore do
  json.center [@record.lat, @record.lng] if @record
  json.center [51.55227613396215, 0.26617169380187999] unless @record
  json.zoom 10
end

json.collectionStore({})
json.set! :collectionStore do
  json.set! :collections do
    json.array! @collections do |collection|
      json.partial! 'collections/collection', {locals: {collection: collection}}
    end
  end
end
