module FieldDefinitions
  module Record
    extend ActiveSupport::Concern
    included do
      field :id, type: 'integer'
      field :title, type: 'text', analyzer: :english
      field :sort_title, type: :integer
      field :description, type: 'text', analyzer: :english
      field :excerpt, type: 'text', analyzer: :english
      field :like_count, type: 'integer'
      field :view_count, type: 'integer'
      field :featured_item, type: :boolean
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
        field :description, type: 'text'
        field :avatar_url, type: 'keyword'
      end

      field :collection_ids
      
      field :collections, type: :nested, value: -> {
          collections.collect do |collection|
            {
              id: collection.id,
              title: collection.title,
              image: collection.primary_image.try(:attachable).try(:data).try(:slice, *[:thumb, :content_type, :suffix]),
              contributing_user_id: collection_records.find_by(collection_id: collection.id).contributing_user_id,
              read_state: collection.read_state,
              write_state: collection.write_state,
              write_state_team_id: collection.write_state_team_id,
              owner_type: collection.owner_type,
              owner_id: collection.owner_id
            }
          end
      }

      field :tag_groups, type: :nested, value: -> {
        tag_groups.collect do |tag_group|
          {
            id: tag_group.id,
            name: tag_group.name, slug: tag_group.slug,
            tags: tag_group.tags.select{|t| tags.include?(t)}.collect do |tag|
              {
                id: tag.id, name: tag.name, slug: tag.slug, tag_group_id: tag.tag_group_id
              }
            end
          }
        end
      }
      field :tag_group_ids, value: -> {tag_group_ids}
      field :tag_ids, value: -> {tag_ids}
      field :related_record_ids, value: -> {
        related.collect(&:id)
      }

      field :user_collections do
        field :value, value: ->{id}
        field :label, value: ->{title}
      end

      field :everyone_collections do
        field :value, value: ->{id}
        field :label, value: ->{title}
      end

      field :team_id
      field :allow_team_editing

      field :attachments, type: 'object', value: -> {
        attachments.select{|a| a.attachable.data}.collect do |attachment|
          {
            id: attachment.id,
            title: attachment.title,
            caption: attachment.caption,
            credit: attachment.credit,
            attachable_type: attachment.attachable_type,
            attachable: attachment.attachable.data,
            is_primary: attachment.attachable.try(:primary)

          }
        end
      }

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
      field :valid_for_publishing, type: 'boolean'
      field :errors_on_publishing, type: 'object'
      field :has_autogenerated_title, type: 'boolean'
      field :autogenerated_date_from_fields, value: ->(r) {r.autogenerated_date_from_fields}
      field :autogenerated_date_to_fields, value: ->(r) {r.autogenerated_date_to_fields}

      field :added_by_student, type: 'boolean'
      field :student_details, type: 'keyword'
    end
  end
end