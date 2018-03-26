class CreateTeamUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :team_users do |t|
      t.references :team, foreign_key: true
      t.references :user, foreign_key: true
      t.integer :role

      t.timestamps
    end
  end
end
