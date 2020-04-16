require 'test_helper'

module LayersOfLondon::Booth::MapTool
  class PolygonsControllerTest < ActionDispatch::IntegrationTest
    include Engine.routes.url_helpers

    test "should get index" do
      get polygons_index_url
      assert_response :success
    end

    test "should get create" do
      get polygons_create_url
      assert_response :success
    end

    test "should get update" do
      get polygons_update_url
      assert_response :success
    end

    test "should get destroy" do
      get polygons_destroy_url
      assert_response :success
    end

  end
end
