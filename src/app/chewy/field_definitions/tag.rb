module FieldDefinitions
  module Tag
    extend ActiveSupport::Concern
    included do
      def self.policy_class
        TagGroupPolicy
      end

      field :id, type: 'integer'
      field :name, type: 'text', analyzer: :english
      field :slug, type: 'keyword'
      field :tag_group_id, type: :integer
    end
  end
end