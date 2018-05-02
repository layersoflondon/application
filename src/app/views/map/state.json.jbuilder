record = @data.find{|r| r.is_a?(Record)}

json.set! :trayViewStore do
  json.previousCardStore nil
  json.visible_record_id nil
  json.visible_record    nil
  json.tray_is_visible   true
end

json.set! :recordFormStore do
end

json.set! :layersStore do
  json.layers [{id: 1, title: "Roque map", description: "<p>The Roque Map description</p>", date: Date.new, url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false}, {id: 2, title: "Morgan map", description: "<p>The Morgan map description</p>", date: Date.new, url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false}]
end

json.set! :mapViewStore do
  json.center [record.lat, record.lng] if record
  json.center [51.55227613396215, 0.26617169380187999] unless record
  json.zoom 10
end

json.set! :cardStore do
  json.title ""
  json.description ""
  json.rootCardStore true
  json.cards []
end

json.set! :recordStore do
  json.set! :records do
    json.array! @data.select{|r| r.is_a?(Record)} do |record|
      json.partial! 'records/record', record: record
    end
  end
end

json.set! :collectionStore do
  json.set! :collections do
    json.array! @data.select{|r| r.is_a?(Collection)} do |collection|
      json.partial! 'collections/collection', {locals: {collection: collection}}
    end
  end
end
