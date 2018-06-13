class RecordsIndex < Chewy::Index
  def self.policy_class
    "Record"
  end
  settings analysis: {
      analyzer: {
          email: {
              tokenizer: 'keyword',
              filter: ['lowercase']
          }
      }
  }
  define_type Record.includes(:user, :collections, :attachments) do

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
    field :user, type: 'object' do
      field :id, type: 'integer'
      field :email, type: 'keyword'
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
    end
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
  def self.published
    filter(terms: {state: ['published']})
  end
end