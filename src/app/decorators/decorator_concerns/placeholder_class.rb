module DecoratorConcerns
  module PlaceholderClass
    extend ActiveSupport::Concern

    def placeholder_class
      # const number = this.title.split('').map((c) => {return c.charCodeAt() }).reduce((a,b) => a + b, 0) % 10;
      unless has_image?
        "placeholder-#{object.title.each_char.collect(&:ord).sum % 10}"
      end
    end

    def has_image
      object.primary_image.present?
    end
  end
end