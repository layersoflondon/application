ActiveAdmin.register LayerGroup do
  permit_params :name,
                :short_name,
                :description,
                :credit,
                :collection_id,
                :highlighted,
                layer_ids: [],
                image_attributes: [
                  :file,
                  :id
                ]

  controller do
    def new
      @layer_group = LayerGroup.new(image: Attachments::Image.new)
    end

    def show
      redirect_to edit_admin_layer_group_path(resource)
    end
  end

  index do
    selectable_column

    column :name
    column :image do |r|
      if r.image.present?
        image_tag ApplicationController.helpers.activestorage_url_for(r.image.file.variant(Rails.configuration.x.image_variants[:thumb]))
      else
        "No image"
      end
    end

    actions
  end

  filter :title

  form partial: "form"

end
