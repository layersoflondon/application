module DecoratorConcerns
  module Images
    extend ActiveSupport::Concern

    def hero_image
      if has_hero_image?
        fields.hero_image[:sizes][:large]
      else
        h.image_url('map-2.png')
      end
    end

    def list_image
      if has_list_image?
        fields.list_image[:sizes][:medium]
      elsif has_hero_image?
        fields.hero_image[:sizes][:medium]
      end
    end

    def has_hero_image?
      has_field?(:hero_image, Hash)
    end

    def has_list_image?
      has_field?(:list_image, Hash)
    end
  end
end