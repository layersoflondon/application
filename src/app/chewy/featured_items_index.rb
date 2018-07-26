class FeaturedItemsIndex < Chewy::Index

  define_type FeaturedItem do
    field :item_id, type: :integer
    field :item_type, type: :keyword
    field :sort_order, type: :integer
    field :image, type: :object, value: -> {
      case item_type
      when 'Record'
          item.primary_image.try(:data)
        when 'Collection'
          item.primary_image.try(:attachable).try(:data)
      end
    }
    field :title, type: :text, value: -> { item.title}
    field :description, type: :text, value: -> {item.description}
  end
end