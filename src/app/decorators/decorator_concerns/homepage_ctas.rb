module DecoratorConcerns
  module HomepageCtas
    extend ActiveSupport::Concern

    def homepage_ctas
      if has_field?(:homepage_calls_to_action_new, Array)
        fields.homepage_calls_to_action_new.collect do |cta|
          # ["title", "surtitle", "description", "image", "link_text", "link_to_page_or_post", "page_or_post", "link_url"]
          if cta.link_to_page_or_post_new
            linked_entity = cta.page_or_post(raw: true).value.first
            type = Rooftop::Rails::PostTypeResolver.new(linked_entity[:post_type]).resolve
            url = case type
                  when Page
                    type.find(linked_entity[:ID]).nested_path
                  else
                    Rooftop::Rails::RouteResolver.new(linked_entity[:post_type], linked_entity[:slug]).resolve
                  end
          else
            url = cta.link_url
          end
          
          OpenStruct.new({
            title: h.strip_tags(cta.title).html_safe,
            surtitle: h.strip_tags(cta.surtitle).html_safe,
            description: h.strip_tags(cta.description).html_safe,
            image: cta.image.try(:[],:sizes).try(:[],:large),
            link_text: h.strip_tags(cta.link_text).html_safe,
            url: url
                         })
        end
      else
        []
      end
    end
  end
end