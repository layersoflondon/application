module PostCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_posts, only: :show, if: -> {@page.template.present?}

    decorates_assigned :posts, with: PostDecorator
  end

  private

  def get_posts

    @posts = Post.where(filter: {category_name: "guide"}, no_filter: [:filter])
  end
end
