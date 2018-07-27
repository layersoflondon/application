class AddTermsAcceptanceToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :terms_and_conditions_of_use, :boolean
  end
end
