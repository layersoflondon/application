# we always need this lot
json.id record.id
json.title record.title
json.description record.description
json.lat record.pin["lat"]
json.lng record.pin["lon"]
if local_assigns.has_key?(:full) && full
  # stuff we only need for the full record render
  json.partial! 'search/record_full', record: record
else
  json.partial! 'search/record_card', record: record
  
  
end
