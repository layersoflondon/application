module FieldDefinitions
  module Collection
    extend ActiveSupport::Concern

    included do
      field :id, type: :integer
      field :title, type: :text, analyzer: :english
      field :sort_title, type: :integer
      field :view_count, type: 'integer'
      field :description, type: :text, analyzer: :english
      field :read_state, type: :keyword
      field :write_state, type: :keyword
      field :write_state_team_id, type: :integer
      field :featured_item, type: :boolean
      field :state, type: :keyword, value: -> {
        public_read? ? "published" : nil
      }
      field :image, type: :object, value: -> {
        primary_image.try(:attachable).try(:data)
      }
      field :owner, type: :nested do
        field :name, type: :text
        field :id, type: :text
        field :type, type: :keyword, value: -> {self.class.to_s}
      end
      field :owner_type, type: :keyword
      field :owner_id, type: :integer
      field :created_at, type: 'date'
      field :updated_at, type: 'date'
      field :date_from, type: 'date', value: -> {
        records.collect(&:date_from).compact.try(:min)
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

      field :contributor_ids, value: -> {
        if owner.is_a?(Team)
          owner.user_ids.uniq
        elsif write_state == 'everyone'
          records.collect(&:user_id).uniq
        else
          [owner_id]
        end
      }

      field :record_count, type: 'integer', value: ->{ records.count}

      field :records, type: :nested do
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
        field :credit, type: 'text', analyzer: :english
        field :user, type: 'nested' do
          field :id, type: 'integer'
          field :name, type: 'text'
          field :description, type: 'text'
          field :avatar_url, type: 'keyword'
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
            field :description, type: 'text', analyzer: :english
          end
        end
      end
    end

  end
end
