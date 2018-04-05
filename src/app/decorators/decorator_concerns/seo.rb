module DecoratorConcerns
  module SEO
    extend ActiveSupport::Concern

    def meta_keywords
      if has_field?(:meta_keywords, String)
        h.strip_tags(object.fields.meta_keywords)
      end
    end

    def meta_description
      if has_field?(:meta_description, String)
        h.strip_tags(object.fields.meta_description)
      end
    end

    def robot_instructions
      if has_field?(:robot_instructions, Array)
        object.fields.robot_instructions.join(",")
      end
    end
  end
end