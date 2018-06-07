module Alpha
  class Collection < ActiveRecord::Base
    include DatabaseConnection
    include Sluggable

    has_many :collection_pins, dependent: :destroy, inverse_of: :collection
    has_many :pins, through: :collection_pins, inverse_of: :collections, dependent: :nullify
    has_many :users, through: :pins

    has_one :user_collection, inverse_of: :collection, dependent: :destroy
    has_one :user, through: :user_collection
    accepts_nested_attributes_for :user_collection

    has_one :user_group_collection, inverse_of: :collection, dependent: :destroy
    has_one :user_group, through: :user_group_collection
    accepts_nested_attributes_for :user_group_collection

    validates :name, presence: {message: "Please make sure you've included a name for your collection"}

    scope :public_user_collections, -> {
      includes(:user, :user_collection, :pins).where(user_collections: {privacy: 1})
    }

    scope :private_user_collections, ->(user) {
      includes(:user, :user_collection, :pins).where(user_collections: {privacy: 0, user_id: user.try(:id)})
    }

    scope :team_collections_for_user, ->(user) {
      user_group_ids = (user.try(:user_groups) || []).collect(&:id)
      includes(:user_group, :user_group_collection, :pins).references(:user_group_collection).where(user_group_collections: {user_group_id: user_group_ids})
    }

    def owner(user=nil)
      if user_collection
        user_collection.present? && user_collection.restricted? && user_collection.user_id == user.try(:id)
      else
        false
      end
    end

    def availability
      if user_collection
        user_collection.open?
      else
        false
      end
    end
  end

end