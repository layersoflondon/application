ActiveAdmin.register TagGroup do
  menu parent: "Tags"

  permit_params :name

  form do |f|
    f.inputs do
      f.input :name
      f.actions
    end

  end
end

