class AddKeyToTeamUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :team_users, :key, :string
    add_index  :team_users, :key
  end
end
