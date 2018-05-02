record      = @data.find{|r| r.is_a?(Record)}
records     = @data.select{|r| r.is_a?(Record)}
collections = @data.select{|r| r.is_a?(Collection)}
collection  = nil
# collection  = collections.first

if collection
  json.partial! 'maps/partials/collection', {locals: {collection: collection, records: records, collections: collections}}
else
  json.partial! 'maps/partials/records', {locals: {records: records, collections: collections}}
end

json.set! :recordFormStore do
end

json.layersStore({})
json.set! :layersStore do
  json.layers [{id: 1, title: "Roque map", description: "<p>The Roque Map description</p>", date: Date.new, url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false}, {id: 2, title: "Morgan map", description: "<p>The Morgan map description</p>", date: Date.new, url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false}]
end

json.mapViewStore({})
json.set! :mapViewStore do
  json.center [record.lat, record.lng] if record
  json.center [51.55227613396215, 0.26617169380187999] unless record
  json.zoom 10
end

json.collectionStore({})
json.set! :collectionStore do
  json.set! :collections do
    json.array! @data.select{|r| r.is_a?(Collection)} do |collection|
      json.partial! 'collections/collection', {locals: {collection: collection}}
    end
  end
end
