module Alpha
  class UserGroup < ActiveRecord::Base
  include DatabaseConnection
    include Sluggable

    belongs_to :primary_user, class_name: "User"
    has_many :pins, through: :users
    has_many :user_group_users, -> {extending UserGroupStates}, dependent: :destroy
    has_many :users, through: :user_group_users

    validates :name, presence: true, uniqueness: true

    has_many :user_group_collections, inverse_of: :user_group, dependent: :destroy
    has_many :collections, through: :user_group_collections, dependent: :destroy

    def invite_user!(user)
      user_group_users.create!(user: user)
    end
  end
end

