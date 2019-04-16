json.id user.id
if session[:teacher_classroom_user].present?
  json.name "#{session[:teacher_classroom_user]} <span>(in a group organised by #{user.name}</span>)"
else
  json.name user.name
end
json.description strip_tags(user.description)
json.avatar_url user.avatar_url
if defined?(records)
  json.records do
    json.array! records do |record|
      json.partial! 'search/record', record: record
    end
  end
end
