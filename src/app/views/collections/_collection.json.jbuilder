json.id lolCollection.id
json.description lolCollection.description
json.attachment_id lolCollection.attachment_id
json.read_state lolCollection.read_state
json.write_state lolCollection.write_state
# Works but not all together
# json.array! lolCollection.records, partial: 'records/record',  as: :record
# Works but not together (2 attemp)
# json.array! lolCollection.records do |record|
#   json.records do
#     json.partial! 'records/record', record: record
#   end
# end
