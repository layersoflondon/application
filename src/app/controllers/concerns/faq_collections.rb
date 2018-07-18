module FaqCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_faqs, only: :show, if: -> {@page.template.present?}

    decorates_assigned :faqs, with: FaqDecorator
  end

  def get_faqs
    @faqs = Rooftop::FaqEntry.all
  end

end