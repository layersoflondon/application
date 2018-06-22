class FaqsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]
  skip_after_action :verify_authorized, only: [:show]
  decorates_assigned :faqs, :faq, with: FaqDecorator

  def show
    @faq = Rooftop::FaqEntry.where(slug: params[:id]).first
  end

end
