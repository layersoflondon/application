# we always need this lot
json.score record._score
json.id record.id
json.title record.title
json.description record.description
json.excerpt record.excerpt
json.lat record.pin["lat"]
json.lng record.pin["lon"]
json.state record.state
if local_assigns.has_key?(:full) && full
  # stuff we only need for the full record render
  json.partial! 'search/record_full', record: record
else
  json.partial! 'search/record_card', record: record
end
