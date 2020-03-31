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
        else
          {lat: 0, lon: 0}
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
        field :state, type: 'keyword'
        field :pin, type: 'geo_point', value: ->{ {lat: lat, lon: lng} }

        field :collection_ids

        field :tag_group_ids, value: -> {tag_group_ids}
        field :tag_ids, value: -> {tag_ids}

        field :image, type: 'object', value: -> {
          primary_image.try(:data)
        }

      end
    end

  end
end
