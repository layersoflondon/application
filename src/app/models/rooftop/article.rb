module Rooftop
  class Article
    include Rooftop::Post

    scope :articles, -> {
      all.to_a.select {|event| !event.has_field?(:is_event,TrueClass)}
    }

    scope :events, -> {
      all.to_a.select {|event| event.has_field?(:is_event,TrueClass)}
    }

  end
end

