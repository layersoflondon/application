json.id attachment.id
json.attachable_type attachment.attachable_type
json.content_type attachment.has_file? ? attachment.file.blob.content_type : nil
# json.byte_size attachment.has_file? ? attachment.file.blob.byte_size: nil
json.url attachment.has_url? ? attachment.url : nil
