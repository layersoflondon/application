class MapController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  before_action :get_json, only: :show

  def index
  end

  def show
  end

  private
  def get_json
    records = Record.all.limit(2) #.all.sample(2)
    collections = Collection.all.limit(1) #.all.sample(1)
    @data = records+collections
  end
end
