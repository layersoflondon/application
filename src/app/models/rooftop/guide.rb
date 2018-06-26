module Rooftop
  class Guide
    include Rooftop::Post

    scope :guides, -> {
      all
    }
  end
end

