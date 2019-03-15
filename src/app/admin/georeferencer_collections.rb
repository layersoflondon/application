ActiveAdmin.register Georeferencer::Project do

  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :georeferencer_id, as: :string, label: "Georeferencer ID (the name of the collection in Georeferencer)"
    end
  end
end