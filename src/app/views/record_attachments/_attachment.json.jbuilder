if attachment # Avoid nil attachment
  json.id attachment.id
  json.title attachment.title
  json.caption attachment.caption
  json.credit attachment.credit
  json.attachable_type attachment.attachable_type
  json.content_type attachment.has_file? ? attachment.file.blob.content_type : nil

  if attachment.has_file?
    json.url url_for(attachment.file)
  elsif attachment.has_url?
    json.url attachment.url
  end

  if attachment.has_image?
    json.is_primary attachment.is_primary
  end
end