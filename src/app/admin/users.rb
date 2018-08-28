ActiveAdmin.register User do
  permit_params :email, :first_name, :last_name, :password, :password_confirmation, :team_ids

  index do
    selectable_column
    id_column
    column :name do |u|
      u.name
    end
    column :email
    column :current_sign_in_at
    column :sign_in_count
    actions
  end

  controller do
    def update_resource(object, attributes)
      update_method = attributes.first[:password].present? ? :update_attributes : :update_without_password
      object.send(update_method, *attributes)
    end

    def update
      update! do |f|
        f.html {redirect_to edit_admin_user_path(params[:id])}
      end
    end
  end

  filter :email
  filter :sign_in_count

  form partial: "form"

end
