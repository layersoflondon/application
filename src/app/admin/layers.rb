ActiveAdmin.register Layer do
  permit_params :title,
                :description,
                :credit,
                :lat,
                :lng,
                :date_from,
                :date_to,
                :layer_type,
                :tileserver_url,
                image_attributes: [
                  :file
                ]

  controller do
    def update
      update! do |f|
        f.html {redirect_to edit_admin_layer_path(params[:id])}
      end
    end

    def new
      @layer = Layer.new(image: Attachments::Image.new)
    end

  end

  index do
    selectable_column

    column :title
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
