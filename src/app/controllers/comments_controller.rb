class CommentsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    @comments = Record.find(params[:record_id]).comments
  end

  def create
    @comment = current_user.comments.build(comment_params.merge({record_id: params[:record_id]}))
    byebug

    authorize(@comment)

    @comment.save
  end

  def update
    @comment = Comment.find(params[:id])

    authorize(@comment)

    @comment.save
  end

  def destroy
    @comment = Record.find(params[:record_id]).comments.find(params[:id])

    authorize(@comment)
    @comment.destroy
  end

  private
  def comment_params
    params.require(:comment).permit(:content, :status)
  end
end
