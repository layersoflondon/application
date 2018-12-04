ActiveAdmin.register Collection do
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
  permit_params [Collection.column_names.collect(&:to_sym), record_ids: []]

  controller do
    def scoped_collection
      super.includes(:records).references(:records)
    end

    def update
      update! do |f|
        f.html {redirect_to edit_admin_collection_path(params[:id])}
      end
    end

    def create
      @collection = Collection.new(permitted_params[:collection])
      @collection.owner = current_user
      @collection.collection_records.each {|cr| cr.contributing_user = current_user unless cr.contributing_user.present?}

      super
    end
  end

  filter :title
  filter :record_title_con, label: "Record titles"
  filter :owner_type

  index do
    selectable_column
    column :title
    column :owner_type do |r|
      r.owner_type.humanize
    end
    column :owner do |r|
      r.owner.name
    end
    
    actions
  end


  form partial: "form"




end
