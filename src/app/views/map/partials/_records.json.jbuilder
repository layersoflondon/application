json.trayViewStore({})
json.set! :trayViewStore do
  json.previousCardStore nil
  json.visible_record_id nil
  json.visible_record    nil
  json.tray_is_visible   true

  json.set! :cardStore do
    json.title ""
    json.description ""
    json.rootCardStore true
    json.set! :cards do
      json.array! (records+collections) do |object|
        if object.is_a?(Record)
          json.partial! 'records/record', record: object
        else
          json.partial! 'collections/collection', {locals: {collection: object}}
        end
      end
    end
  end
end