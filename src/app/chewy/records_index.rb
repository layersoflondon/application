class RecordsIndex < Chewy::Index
  def self.policy_class
    "Record"
  end
  
  define_type Record.includes(:user, :attachments, collections: [:owner]) do

    field :id, type: 'integer'
    field :title, type: 'text', analyzer: :english
    field :description, type: 'text', analyzer: :english
    field :excerpt, type: 'text', analyzer: :english
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
    field :user, type: 'nested' do
      field :id, type: 'integer'
      field :name, type: 'text'
    end

    field :collection_ids

    field :user_collections do
      field :value, value: ->{id}
      field :label, value: ->{title}
    end

    field :everyone_collections do
      field :value, value: ->{id}
      field :label, value: ->{title}
    end

    field :attachments, type: 'object' do
      field :id, type: 'integer'
      field :title, type: 'text', analyzer: :english
      field :caption, type: 'text', analyzer: :english
      field :credit, type: 'text', analyzer: :english
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
        field :description, type: 'text', analyzer: :english
      end
    end

    field :view_type, type: 'keyword'
  end

  def self.user_records(search_params, limit: 100)
    es_query = Chewy::Search::Request.new(RecordsIndex).query(
      nested: {
        path: "user",
        query: {
          bool: {
            must: [
              {
                match: {"user.id" => search_params[:user_id]}
              }
            ]
          }
        }
      }
    )

    es_query.limit(limit)
  end

  def self.published
    filter(terms: {state: ['published']})
  end
end