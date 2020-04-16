require 'test_helper'

module LayersOfLondon::Booth::MapTool
  class MaptoolsControllerTest < ActionDispatch::IntegrationTest
    include Engine.routes.url_helpers

    test "should get show" do
      get maptools_show_url
      assert_response :success
    end

  end
end
