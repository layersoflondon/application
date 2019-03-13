class AddTeamIdToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :team_id, :integer
    add_column :records, :allow_team_editing, :boolean, default: false

  end
end
