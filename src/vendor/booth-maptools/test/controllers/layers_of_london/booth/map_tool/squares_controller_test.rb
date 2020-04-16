require 'test_helper'

module LayersOfLondon::Booth::MapTool
  class SquaresControllerTest < ActionDispatch::IntegrationTest
    include Engine.routes.url_helpers

    test "should get index" do
      get squares_index_url
      assert_response :success
    end

    test "should get show" do
      get squares_show_url
      assert_response :success
    end

    test "should get create" do
      get squares_create_url
      assert_response :success
    end

    test "should get edit" do
      get squares_edit_url
      assert_response :success
    end

    test "should get update" do
      get squares_update_url
      assert_response :success
    end

  end
end
