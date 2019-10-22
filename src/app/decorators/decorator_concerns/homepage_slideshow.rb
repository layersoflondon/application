module DecoratorConcerns
  module HomepageSlideshow
    extend ActiveSupport::Concern

    def slideshow_title
      fields.slideshow_title
    end

    def slideshow_subtitle
      fields.slideshow_subtitle 
    end

    def slideshow_link
      page = fields.slideshow_cta_link(raw: true).value.first

      Page.find(page[:ID]).nested_path if page
    end

    def slideshow_button_text
      fields.slideshow_cta_button_text
    end

    def slides 
      if has_field?(:slides)
        fields.slides.map do |slide|
          ["image", "caption"]

          OpenStruct.new({
              image: slide.image.try(:[],:sizes).try(:[],:large),
              caption: h.strip_tags(slide.caption).html_safe,
          })
        end
      else 
        []
      end
    end
  end
end