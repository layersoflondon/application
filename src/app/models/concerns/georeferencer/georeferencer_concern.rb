module Georeferencer
  module GeoreferencerConcern
    extend ActiveSupport::Concern

    included do
      include Her::Model
      include ClassMethods
    end

    module ClassMethods
      def all!
        batch = self.all.fetch
        images = [batch.to_a]
        loop do
          start = nil

          if batch.metadata.present?
            start = batch.metadata[:start]
          else
            break
          end

          batch = self.where(start: start).fetch
          images.push batch
        end

        images.flatten
      end
    end

    def cache_key
      "#{self.class.to_s.split("::").join('-').downcase}-#{id}"
    end
  end
end
