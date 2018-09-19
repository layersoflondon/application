module SortFields

  def sort_title
    score = 0
    string_title = title.gsub(/\W+|[0-9]/,'')
    if string_title.present?
      score += string_title.each_char.first.ord
    else
      # we've got an all-number title - shove to the back
      score += 128
    end
    if title.each_char.first.match(/\d/)
      score += (title.each_char.first.match(/\d/)[0].to_i * 10)
    end
    score
  end
end