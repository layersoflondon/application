ActiveAdmin.register Record do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end
#
#
  controller do
    def scoped_collection
      super.includes(:user).references(:user)
    end

  end

  filter :title
  filter :user


  index do
    column :id
    column :title
    column :owner do |r|
      r.user.name
    end
    column :map do |r|
      link_to "View on map", resource_map_path(resource: "records", id: r.id) if r.published?
    end
    actions
  end


end
