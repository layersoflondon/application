class AddAgreesToMarketingToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :agrees_to_marketing, :boolean
  end
end
