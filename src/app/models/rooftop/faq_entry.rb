module Rooftop
  class FaqEntry
    include Rooftop::Post

    scope :events, -> {
      all
    }
  end
end

