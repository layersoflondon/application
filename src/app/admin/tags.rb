ActiveAdmin.register Tag do
  menu parent: "Tags"

  permit_params :name, :tag_group_id

  form do |f|
    f.inputs do
      f.input :name
      f.input :tag_group, as: :radio
      f.actions
    end

  end
end

