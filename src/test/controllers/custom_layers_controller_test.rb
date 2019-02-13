require 'test_helper'

class CustomLayersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get custom_layers_index_url
    assert_response :success
  end

  test "should get show" do
    get custom_layers_show_url
    assert_response :success
  end

end
