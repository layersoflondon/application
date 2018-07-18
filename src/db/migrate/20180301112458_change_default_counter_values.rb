class ChangeDefaultCounterValues < ActiveRecord::Migration[5.2]
  def up
    change_column :records, :like_count, :integer, default:0
    change_column :records, :view_count, :integer, default:0
  end

  def down
    change_column :records, :like_count, :integer, defaul:nil
    change_column :records, :view_count, :integer, defaul:nil
  end
end
