class CreateUserTeams < ActiveRecord::Migration[5.2]
  def change
    create_table :user_teams do |t|
      t.references :user, foreign_key: true
      t.references :team, foreign_key: true

      t.timestamps
    end
  end
end
