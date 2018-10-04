class AddStudentInfoToRecord < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :added_by_student, :boolean
    add_column :records, :student_details, :string
  end
end
