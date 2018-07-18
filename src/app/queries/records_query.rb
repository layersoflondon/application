module RecordsQuery
  extend ActiveSupport::Concern

  class_methods do
    def filter_by_geobounds(search_params)
      MultiIndexSearch.filter_by_geobounds(search_params, indexes: RecordsIndex)
    end

    def custom_search(search_params)
      MultiIndexSearch.query(search_params, indexes: RecordsIndex)
    end
    
  end
end