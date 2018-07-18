class TaxonomiesController < ApplicationController

  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    @taxonomies = Taxonomy.all
  end
end
