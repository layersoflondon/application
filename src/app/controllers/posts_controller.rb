class PostsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]
  skip_after_action :verify_authorized, only: [:show]
  decorates_assigned :posts, :post, with: PostDecorator

  layout 'templates/article'

  def show
    @post = Post.find_by(slug: params[:id]).first
    raise Rooftop::RecordNotFoundError, "Post not found" unless @post.present?
  end
end
