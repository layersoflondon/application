ActiveAdmin.register Team do
  permit_params :name, :description, leader_ids: [], contributor_ids: []

  controller do
    def update
      update! do |f|
        f.html {redirect_to edit_admin_team_path(params[:id])}
      end
    end
  end

  index do
    selectable_column

    column :name
    column :description
    column :leaders do |t|
      t.leaders.collect(&:name).join(", ")
    end

    actions
  end

  filter :name


  form partial: "form"

end
