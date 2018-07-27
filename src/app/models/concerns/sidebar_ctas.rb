module SidebarCtas
  extend ActiveSupport::Concern
  def sidebar_ctas
    # TODO why isn't resolve_relations working?
    if has_field?(:sidebar_ctas, Array)
      sidebar_cta_ids = fields.sidebar_ctas(raw:true).value
      if sidebar_cta_ids.is_a?(Array) && sidebar_cta_ids.any?
        SidebarCta.where(id: sidebar_cta_ids)
      else
        []
      end
    else
      []
    end
  end
end