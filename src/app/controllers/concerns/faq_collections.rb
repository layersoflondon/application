module FaqCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_faqs, only: :show, if: -> {@page.template.present? && @page.template.underscore.in?(['help_centre', 'faq_list'])}
    before_action :get_top_faqs, only: :show, if: -> {@page.template.present? && @page.template.underscore.in?(['help_centre'])}

    decorates_assigned :faqs, :top_faqs, with: FaqDecorator
  end

  def get_faqs
    @faqs = Rooftop::FaqEntry.where(orderby: :menu_order, order: :asc)
  end

  def get_top_faqs
    @top_faqs = Rooftop::FaqEntry.where(post__in: @page.fields.top_faqs(raw: true).value, orderby: :post__in)
  end

end