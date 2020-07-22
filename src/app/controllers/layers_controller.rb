MAX_HIGHLIGHTED_LAYERS = 4
MAX_DIRECTORY_LAYERS = 9

class LayersController < ApplicationController
  # before_action :set_layer, only: %i[show]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show search export]

  def index
    page = params[:page].present? ? params[:page].to_i : 1
    per_page = params[:per_page].present? ? params[:per_page].to_i : MAX_DIRECTORY_LAYERS

    offset = per_page * (page-1)

    @layer_groups = LayerGroupsIndex.all.sorted_by_date

    if params[:explain].present? && Rails.env.development?
      @layer_groups = @layer_groups.explain
    end

    if params[:query].present?
      @layer_groups = @layer_groups.search(params[:query])
    end

    if params[:category_id].present?
      @layer_groups = @layer_groups.with_category_id(params[:category_id])
    end  
    
    if params[:term_id].present?
      @layer_groups = @layer_groups.with_term_id(params[:term_id]).boost_highlight
    end

    if params[:ids].present?
      @layer_groups = @layer_groups.filter(ids: {values: params[:ids]})
    end

    @layer_groups = @layer_groups.limit(per_page).offset(offset)
    response.set_header("X-Total-Pages", @layer_groups.total_pages)
    response.set_header("X-Page", page)


  end
  
  def show
    slug = "#{params[:id]}"
    @layer_group = LayerGroupsIndex.query{match(slug: slug)}.first
  end

  def search
    @layer_groups = LayerGroup.where("title like :query", {query: "%#{params[:query]}%"})
                  .or(LayerGroup.where("description like :query", {query: "%#{params[:query]}%"}))
  end

  def export
    slug = "#{params[:layer_id]}"
    @layer_group = LayerGroupsIndex.query{match(slug: slug)}.first

    unless File.exists?(LayerGroup.export_filepath(slug))
      layer_group = LayerGroup.find(slug)
      layer_group.generate_export
    end

    send_file LayerGroup.export_filepath(slug), type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", disposition: 'attachment'
  end

  private

  def set_layer
    @layer_group = LayerGroup.find_by_id(params[:id])
    render json: '', status: :not_found unless @layer_group
  end

  def query_params
    params.permit(:q, :name, :description, :slug)
  end
end
