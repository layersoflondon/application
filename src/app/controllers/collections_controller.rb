class CollectionsController < ApplicationController
  def index
    @collections = Collection.all
  end

  def show
    @collection = Collection.find(params[:id])
  end

  def new
  end

  def edit
  end

  def create
    @collection = Collection.find(params[:id])
  end

  def update
  end

  def destroy
  end
end
