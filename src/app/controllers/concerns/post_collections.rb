module PostCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_posts, only: :show, if: -> {@page.template.present? && @page.template.underscore == 'article_list'}

    decorates_assigned :posts, with: PostDecorator
  end

  private

  def get_posts

    @posts = Post.all
  end
end
