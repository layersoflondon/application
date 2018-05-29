module Rooftop
  class Event
    include Rooftop::Post

    scope :events, -> {
      all
    }
  end
end

