ActiveAdmin.register Tag do
  menu parent: "Tags"

  permit_params :name, :tag_group_id, :sort_order

  orderable
  config.sort_order = 'sort_order_asc'

  form do |f|
    f.inputs do
      f.input :name
      f.input :tag_group, as: :radio
      f.actions
    end

  end

  index do
    orderable_handle_column
    column :name
    column :tag_group
    actions
  end
end

