require_dependency "layers_of_london/booth/map_tool/application_controller"

module LayersOfLondon::Booth::MapTool
  class PolygonsController < ApplicationController
    def index
      skip_authorization
      features = LayersOfLondon::Booth::MapTool::Polygon.all.collect do |poly|
        user_can_edit = LayersOfLondon::Booth::MapTool::PolygonPolicy.new(current_user, poly).update?
        poly.to_json(user_can_edit: user_can_edit)
      end

      feature = {
        type: "FeatureCollection",
        features: features
      }
      render json: feature
    end

    def show
      poly = LayersOfLondon::Booth::MapTool::Polygon.find(params[:id])
      authorize poly

      user_can_edit = LayersOfLondon::Booth::MapTool::PolygonPolicy.new(current_user, poly).update?
      render json: poly.to_json(user_can_edit: user_can_edit)
    end

    def create
      square = LayersOfLondon::Booth::MapTool::Square.find(params[:square_id]) rescue LayersOfLondon::Booth::MapTool::Square.create
      poly = square.polygons.create(user: current_user, feature: polygon_params)
      authorize poly

      render json: poly.to_json(user_can_edit: true)
    end

    def update
      poly = LayersOfLondon::Booth::MapTool::Polygon.find(params[:id])
      authorize poly

      return render json: {data: "Error"}, status: :unprocessable_entity unless poly

      poly.assign_attributes(feature: polygon_params)

      if poly.save
        render json: poly.to_json(user_can_edit: true)
      else
        render json: {data: "Error"}, status: :unprocessable_entity
      end
    end

    def destroy
      poly = LayersOfLondon::Booth::MapTool::Polygon.find(params[:id])
      authorize poly

      return render json: {data: "Error"}, status: :unprocessable_entity unless poly

      if poly.destroy
        render json: :ok, status: :ok
      else
        render json: :error, status: :unprocessable_entity
      end
    end

    private
    def polygon_params
      params.require(:feature)
    end
  end
end
