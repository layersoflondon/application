ActiveAdmin.register TagGroup do
  menu parent: "Tags"

  permit_params :name, :sort_order

  orderable
  config.sort_order = 'sort_order_asc'



  form do |f|
    f.inputs do
      f.input :name
      f.actions
    end

  end

  index do
    orderable_handle_column
    column :name
    column :tags do |group|
      group.tags.collect(&:name).join(", ")
    end
    actions
  end
end

