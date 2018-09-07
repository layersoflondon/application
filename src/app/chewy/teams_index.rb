class TeamsIndex < Chewy::Index

  def self.policy_class
    "Team"
  end


  define_type Team.includes(team_users: :user, collections: {collection_records: :record}).references(team_users: :user, collections: {collection_records: :record}) do
    field :id, type: :integer
    field :name, type: :text, analyzer: :english
    field :description, type: :text, analyzer: :english
    field :leaders, type: :object do
      field :id, type: :integer
      field :name, type: :text, value: -> { name }
    end
    field :contributors, type: :object do
      field :id, type: :integer
      field :name, type: :text, value: -> { name }
    end
    field :collections, type: :object do
      include FieldDefinitions::Collection
    end
  end
end