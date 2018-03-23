json.id attachment.id
json.attachable_type attachment.attachable_type
json.content_type attachment.has_file? ? attachment.file.blob.content_type : nil
# json.byte_size attachment.has_file? ? attachment.file.blob.byte_size: nil
# TODO this is a hack
if attachment.has_file?
  json.url url_for(attachment.file)
elsif attachment.has_url?
  json.url attachment.url
end