class AddShowOnWebsiteToGeoreferencerProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :georeferencer_projects, :show_on_website, :boolean, default: true
  end
end
