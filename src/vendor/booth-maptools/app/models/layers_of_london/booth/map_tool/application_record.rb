module LayersOfLondon
  module Booth
    module MapTool
      class ApplicationRecord < ActiveRecord::Base
        self.abstract_class = true
      end
    end
  end
end
