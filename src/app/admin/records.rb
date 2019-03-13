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
  # Get all fields for all types of attachment (i.e. any class in the Attachments module)
  column_names = Attachments.constants.select {|c| Attachments.const_get(c).is_a?(Class)}.collect {|c| Attachments.const_get(c).send(:column_names)}.flatten.uniq.collect(&:to_sym)
  # Permit all columns on Record and all columns on attachables.
  permit_params [Record.column_names.collect(&:to_sym), attachments_attributes: [:id, :_destroy, attachable_attributes: column_names.push(:_destroy)]]
  
  controller do
    def scoped_collection
      super.includes(:user).references(:user)
    end

   def show
     redirect_to edit_admin_record_path(resource)
   end

  end

  scope :published
  scope :draft
  scope :flagged

  filter :title
  filter :user_email_cont, label: "User Email", placeholder: "person@example.com"


  index do
    selectable_column
    column :id
    column :title
    column :state do |r|
      r.state.titleize
    end
    column :owner do |r|
      r.user.name
    end
    column :map do |r|
      link_to "View on map", resource_map_path(resource: "records", id: r.id) if r.published?
    end
    actions
  end

  batch_action 'Set status to draft', confirm: 'Set selected records to draft?' do |ids|
    batch_action_collection.find(ids).each do |record|
      record.mark_as_draft!
    end
    redirect_to collection_path, alert: "The records have been set to draft"
  end

  form partial: "form"
  



end
