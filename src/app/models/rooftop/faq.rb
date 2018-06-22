module Rooftop
  class Faq
    include Rooftop::Post

    scope :faqs, -> {
      all
    }
  end
end

