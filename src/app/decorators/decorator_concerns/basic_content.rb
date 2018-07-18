module DecoratorConcerns
  module BasicContent
    def title
      object.title.html_safe
    end

    def content
      h.parse_content(fields.content).html_safe
    end

    def excerpt
      if fields.excerpt.present?
        h.strip_tags(fields.excerpt).html_safe
      else
        h.strip_tags(fields.content).truncate(200).html_safe
      end
    end
  end
end