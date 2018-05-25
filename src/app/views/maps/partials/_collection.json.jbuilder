json.trayViewStore({})
json.set! :trayViewStore do
  json.visible_record_id nil
  json.visible_collection_id collection.try(:id)
  json.visible_record    nil
  json.tray_is_visible   true
  json.previous_card_store do
    json.title ""
    json.description ""
    json.root_card_store true

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

  json.set! :card_store do
    json.title collection.title
    json.description collection.description
    json.root_card_store false
    json.set! :cards do
      json.array! collection.records do |object|
        json.partial! 'records/record', record: object
      end
    end
  end
end