ActiveAdmin.register Layer do
  permit_params :title,
                :short_title,
                :description,
                :credit,
                :lat,
                :lng,
                :layer_type,
                :date_from,
                :date_to,
                data_attributes: [
                  :file,
                  :id
                ],
                layer_data: [:url, :data, :collection_id]

  controller do
    def new
      @layer = Layer.new(layer_type: 'tileserver', data: Attachments::Document.new)
    end

    def show
      redirect_to edit_admin_layer_path(resource)
    end
  end

  index do
    selectable_column

    column :title
    column :layer_type

    actions
  end

  filter :title

  form partial: "form"

end
