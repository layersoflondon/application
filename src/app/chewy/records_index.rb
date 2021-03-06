class RecordsIndex < Chewy::Index
  def self.policy_class
    "Record"
  end
  
  define_type Record.includes(:user, :attachments, :tag_groups, :tags, collections: [:owner]).preload(attachments: :attachable) do
    include FieldDefinitions::Record
  end

  def self.user_records(search_params, limit: 200, record_states: ['draft', 'published'])
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

    es_query.filter(terms: {state: record_states}).limit(limit)
  end

  def self.published
    filter(terms: {state: ['published']})
  end

  def self.in_state(states)
    filter(terms: {state: states})
  end

  def self.with_tags(tag_ids, limit: 200)
    filter(terms: {tag_ids: tag_ids}).limit(limit)
  end

  def self.with_tag_groups(tag_group_ids, limit: 200)
    filter(terms: {tag_group_ids: tag_group_ids}).limit(limit)
  end
end