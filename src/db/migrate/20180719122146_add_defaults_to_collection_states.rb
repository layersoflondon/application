class AddDefaultsToCollectionStates < ActiveRecord::Migration[5.2]
  def change
    change_column :collections, :read_state, :integer, default: 0
    change_column :collections, :write_state, :integer, default: 0
  end
end
