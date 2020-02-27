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

    if params[:query].present? && !params[:page].present?
      @layer_groups = LayerGroupsIndex.search(params[:query]).limit(per_page).limit(per_page).offset(offset)
      response.set_header("X-Total-Pages", @layer_groups.total_pages)
    elsif params[:query].present? && params[:page].present?
      @layer_groups = LayerGroupsIndex.highlighted(is_highlighted: false).search(params[:query]).limit(per_page).offset(offset)
      response.set_header("X-Total-Pages", @layer_groups.total_pages)
    elsif params.has_key?(:overview) # set this to return limited highlights & directory results
      directory_layers   = LayerGroupsIndex.highlighted(is_highlighted: false).limit(per_page)
      highlighted_layers = LayerGroupsIndex.highlighted.limit(MAX_HIGHLIGHTED_LAYERS)
      @layer_groups = [highlighted_layers, directory_layers].flatten
      response.set_header("X-Total-Pages", directory_layers.total_pages)
    elsif params.has_key?(:layer_category)
      highlighted_layers = LayerGroupsIndex.highlighted.limit(MAX_HIGHLIGHTED_LAYERS)
      directory_layers = LayerGroupsIndex.with_category(layer_category_id: params[:layer_category]).limit(per_page).offset(offset)
      response.set_header("X-Total-Pages", directory_layers.total_pages)
      @layer_groups = [highlighted_layers, directory_layers].flatten
    elsif params.has_key?(:layer_term)
      highlighted_layers = LayerGroupsIndex.highlighted.limit(MAX_HIGHLIGHTED_LAYERS)
      directory_layers = LayerGroupsIndex.with_term(layer_term_id: params[:layer_term]).limit(per_page).offset(offset)
      response.set_header("X-Total-Pages", directory_layers.total_pages)
      @layer_groups = [highlighted_layers, directory_layers].flatten
    else
      @layer_groups = LayerGroupsIndex.highlighted(is_highlighted: false).limit(per_page).offset(offset)
      response.set_header("X-Total-Pages", @layer_groups.total_pages)
    end
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
