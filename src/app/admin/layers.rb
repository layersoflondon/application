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
                layer_data: [:url, :collection_id, :vector_tiles, :vector_layer_colour]

  controller do
    def new
      @layer = Layer.new(layer_type: 'tileserver')
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
