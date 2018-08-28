ActiveAdmin.register_page "Dashboard" do

  menu priority: 1, label: proc{ I18n.t("active_admin.dashboard") }

  content title: proc{ I18n.t("active_admin.dashboard") } do

    # Here is an example of a simple dashboard with columns and panels.
    #
    columns do
      column do
        panel "Homepage Highlights" do
          ul do
            FeaturedItem.all.collect do |featured_item|
              li case featured_item.item_type
                 when 'Record'
                   link_to featured_item.item.title, edit_admin_record_path(featured_item.item.id)
                 when 'Collection'
                   link_to featured_item.item.title, edit_admin_collection_path(featured_item.item.id)
                 end
            end
          end
        end
      end

      column do
        panel "Info" do
          para "Welcome to ActiveAdmin."
        end
      end
    end
  end # content
end
