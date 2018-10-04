class AddTeacherAttributesToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :role, :integer
    add_column :users, :teacher_token, :string
    add_column :users, :teacher_token_expires, :datetime
  end
end
