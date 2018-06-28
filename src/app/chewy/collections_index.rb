class CollectionsIndex < Chewy::Index
  define_type Collection.includes(:records).references(:records) do
    field :id, type: :integer
    field :title, type: :text
    field :description, type: :text
    field :read_state, type: :keyword
    field :write_state, type: :keyword
    field :image, type: :object, value: -> {
      primary_image.try(:attachable).try(:data)
    }
    field :owner, type: :object do
      field :name, type: :text
      field :id, type: :text
      field :type, type: :keyword, value: -> {self.class.to_s}
    end
    field :created_at, type: 'date'
    field :updated_at, type: 'date'
    field :date_from, type: 'date', value: -> {
      records.collect(&:date_from).min
    }
    field :pin, type: 'geo_point', value: ->{
      if records.any?
        lats = records.collect(&:lat)
        lngs = records.collect(&:lng)
        mid_lat = lats.min + ((lats.max - lats.min) / 2)
        mid_lng = lngs.min + ((lngs.max - lngs.min) / 2)
        {lat: mid_lat, lon: mid_lng}
      end
      
    }
    field :records, type: :object do
      field :id, type: 'integer'
      field :title, type: 'text'
      field :description, type: 'text'
      field :like_count, type: 'integer'
      field :view_count, type: 'integer'
      field :state, type: 'keyword'
      field :pin, type: 'geo_point', value: ->{ {lat: lat, lon: lng} }
      field :date_from, type: 'date'
      field :date_to, type: 'date'
      field :created_at, type: 'date'
      field :updated_at, type: 'date'
      field :location, type: 'object'
      field :credit, type: 'text'
      field :user, type: 'object' do
        field :id, type: 'integer'
        field :name, type: 'text'
      end
      field :collections, type: 'object' do
        field :read_state, type: 'keyword'
      end
      field :attachments, type: 'object' do
        field :id, type: 'integer'
        field :title, type: 'text'
        field :caption, type: 'text'
        field :credit, type: 'text'
        field :attachable_type, type: 'keyword'
        field :attachable, type: 'object', value: -> {attachable.data}
      end

      field :image, type: 'object', value: -> {
        primary_image.try(:data)
      }
      field :taxonomy_terms, type: 'object' do
        field :id, type: 'integer'
        field :name, type: 'keyword'
        field :taxonomy, type: 'object' do
          field :id, type: 'integer'
          field :name, type: 'keyword'
          field :description, type: 'text'
        end
      end
    end
  end
end