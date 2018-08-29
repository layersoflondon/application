if record.image.is_a?(Hash)
  json.image record.image.select {|k, v| k.in?(['card','marker'])}
else
  json.image placeholder_image.select {|k, v| k.in?(['card','marker'])}
end