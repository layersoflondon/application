module Alpha
  class UserGroupCollection < ActiveRecord::Base
  include DatabaseConnection
    belongs_to :user_group, inverse_of: :user_group_collections
    belongs_to :collection, inverse_of: :user_group_collection

    validates :user_group, :collection, presence: true
    validates :collection, uniqueness: true
  end
end

