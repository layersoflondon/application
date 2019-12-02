class CollectionsIndex < Chewy::Index

  def self.policy_class
    "Collection"
  end

  define_type Collection.includes(:records).references(:records) do
    include FieldDefinitions::Collection
    field :records, type: :nested do
      include FieldDefinitions::Record
    end
  end

  def self.published(limit: 200)
    filter(bool: {
      must: [
        {
          terms: {
            state: ['published']
          }
        },
        {
          range: {
            record_count: {
              gte: 1
            }
          }
        }
      ]
    }).limit(limit).order(:sort_title)
  end

  def self.user_collections(user_id, limit: 200)
    query = {
      bool: {
        should: [
          {
            nested: {
              path: "owner", query: {
                bool: {
                  must: [
                    {
                      match: {
                        "owner.id" => user_id
                      }
                    },
                    {
                      match: {
                        "owner.type" => "User"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            bool: {
              must: [
                {
                  nested: {
                    path: "owner", query: {
                      bool: {
                        must: [
                          {
                            match: {
                              "owner.type" => "Team"
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  term: {
                    contributor_ids: user_id
                  }
                }
              ]
            }
          }


        ]
      }
    }

    filter(query).limit(limit)
  end

  def self.everyone_collections(exclude_user_id: nil, limit: 1000)
    query = {bool: {
      must: [
        {
          term: {
            write_state: "everyone"
          }
        }
      ]
    }}

    if exclude_user_id
      exclude_user_query = {nested: {
        path: "owner", query: {
          bool: {
            must_not: [
              {match: {"owner.id" => exclude_user_id}}
            ]
          }
        }
      }}
      query[:bool][:must] << exclude_user_query
    end

    filter(query).limit(limit)
  end

  def self.find_with_ordered_records(id)
    find(id).tap { |c| c.records.sort_by! { |r| NaturalSort(r["title"]) } }
  end
end
