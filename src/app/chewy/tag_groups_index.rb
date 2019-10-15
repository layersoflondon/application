class TagGroupsIndex < Chewy::Index
  def self.policy_class
    TagGroupPolicy
  end

  define_type TagGroup.includes(:tags) do
    field :id, type: :integer
    field :name, type: :text, analyzer: :english
    field :slug, type: :keyword
    field :tags, type: :object do
      include FieldDefinitions::Tag
    end
  end
end