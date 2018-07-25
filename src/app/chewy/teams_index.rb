class TeamsIndex < Chewy::Index

  def self.policy_class
    "Team"
  end


  define_type Team.includes(team_users: :user).references(team_users: :user) do
    field :id, type: :integer
    field :name, type: :text, analyzer: :english
    field :description, type: :text, analyzer: :english
    field :leaders, type: :object do
      field :id, type: :integer
      field :name, type: :text, value: -> { name }
      field :email, type: :text, analyzer: :keyword
    end
    field :contributors, type: :object do
      field :id, type: :integer
      field :name, type: :text, value: -> { name }
      field :email, type: :text, analyzer: :keyword
    end
    field :collections, type: :object do
      field :id, type: :integer
      field :title, type: :text, analyzer: :english
    end
  end
end