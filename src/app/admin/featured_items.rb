ActiveAdmin.register FeaturedItem, as: "Homepage Highlight" do
  permit_params :item_type, :item_id, :sort_order

  config.sort_order = 'sort_order_asc'
  config.paginate = false
  config.filters = false

  orderable



  controller do
   def show
     redirect_to edit_admin_homepage_highlight_path(params[:id])
   end
  end

  index do
    orderable_handle_column

    column :item do |r|
      r.item.title
    end
    column :item_type do |r|
      r.item_type
    end
    column :primary_image do |r|
      if r.item.primary_image.present?
        image_tag ApplicationController.helpers.activestorage_url_for(r.item.primary_image.file.variant(Rails.configuration.x.image_variants[:thumb]))
      else
        "No image"
      end
    end

    actions
  end


  form do |f|
    f.inputs do
      f.input :item_type, as: :radio, collection: %w(Record Collection)
      f.input :item, as: :searchable_select, collection: Record.published.order(:title), input_html: {class: "record-options", disabled: f.object.item_type.in?(["Collection", nil])}
      f.input :item, as: :searchable_select, collection: Collection.public_read.order(:title), input_html: {class: "collection-options", disabled: f.object.item_type.in?(["Record", nil])}
    end
    f.actions
  end

end
