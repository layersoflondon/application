ActiveAdmin.register Georeferencer::Project do

  permit_params :name, :description, :georeferencer_id, :show_on_website

  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :georeferencer_id, as: :string, label: "Georeferencer ID (the name of the collection in Georeferencer)"
      f.input :show_on_website, label: "Show on website layermaker page"
      f.actions

    end
  end
end