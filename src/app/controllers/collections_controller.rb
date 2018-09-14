class CollectionsController < ApplicationController
  before_action :set_collection, only: %i[update destroy]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  decorates_assigned :collection, :collections

  def index


    @collections = if user_signed_in? && !params[:everyone].present? && !params[:all].present?
                     CollectionsIndex.filter(terms: {contributor_ids: [current_user.id]}).to_a # collections this user has contributed to
                   elsif user_signed_in? && params[:everyone] && !params[:all].present?
                     # CollectionsIndex.filter(term: {write_state: "everyone"})
                     CollectionsIndex.everyone_collections(exclude_user_id: current_user.id)
                   else
                     # Collection.includes(:owner, records: [:user, record_taxonomy_terms: [:taxonomy_term]]).public_read
                     CollectionsIndex.published.limit(params[:per_page])
                   end
  end

  def for_user
    skip_authorization
    @collections = CollectionsIndex.user_collections(params[:id]).select {|c| CollectionPolicy.new(current_user, c).show? }
  end

  def create
    @collection = current_user.collections.build(collection_params)
    authorize(@collection)

    # todo: work out a better way to determine the owner based on params
    @collection.owner_id = current_user.id if @collection.owner_type == "User"

    if @collection.save
      render json: @collection
    else
      render json: @collection.errors, status: :unprocessable_entity
    end
  end

  def show
    # todo query ES to order by
    @collection = CollectionsIndex.filter(ids: {values: [params[:id]]}).first.tap {|c| c.records.sort! {|r1,r2| r1["title"] <=> r2["title"]}}
    raise Pundit::NotAuthorizedError, "Not allowed to show this Collection" unless CollectionPolicy.new(current_user, @collection).show?
  end

  def update
    @collection = Collection.find_by_id(params[:id])
    authorize(@collection)
    render json: '', status: :not_found unless @collection
    update_collection_params = collection_params.to_h
    @collection.assign_attributes(update_collection_params)
    return @collection if @collection.save
    render json: @collection.errors, status: :unprocessable_entity
  end

  def destroy
    @collection = Collection.find_by_id(params[:id])
    authorize(@collection)
    return render json: '', status: :not_found unless @collection
    return render json: '', status: :no_content if @collection.destroy
    render json: @collection.errors, status: :unauthorized
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_collection
    @collection = Collection.find_by_id(params[:id])
    render json: '', status: :not_found unless @collection
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def collection_params
    params.require(:collection).permit(
      :title,
      :description,
      :read_state,
      :write_state,
      :write_state_team_id,
      :owner_id,
      :owner_type
    )
  end
end
