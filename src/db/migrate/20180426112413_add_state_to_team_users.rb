class AddStateToTeamUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :team_users, :state, :string
  end
end
