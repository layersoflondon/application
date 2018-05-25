json.trayViewStore({})
json.set! :trayViewStore do
  json.previous_card_store nil

  if @record
    json.visible_record_id @record.id
    json.visible_record do
      json.partial! 'records/record', record: @record
    end
  else
    json.visible_record_id nil
    json.visible_record    nil
  end

  json.tray_is_visible   true

  json.set! :card_store do
    json.title ""
    json.description ""
    json.root_card_store true
    json.set! :cards do
      json.array! ((records+collections).sort_by(&:updated_at)) do |object|
        if object.is_a?(Record)
          json.partial! 'records/record', record: object
        else
          json.partial! 'collections/collection', {locals: {collection: object}}
        end
      end
    end
  end
end
