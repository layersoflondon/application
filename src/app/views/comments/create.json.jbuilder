json.id @comment.id
json.content @comment.content
json.datetime @comment.created_at.strftime("%D %T")
json.user do
  json.id @comment.user.id
  json.name @comment.user.name
end
