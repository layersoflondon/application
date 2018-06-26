module ArticleCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_articles, :get_events, only: :show, if: -> {@page.template.present?}

    decorates_assigned :articles, :events, with: ArticleDecorator
  end

  def get_articles
    @articles = Rooftop::Article.articles
  end

  def get_events
    @events = Rooftop::Article.events
  end
end