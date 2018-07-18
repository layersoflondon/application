require 'test_helper'

class LayersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get layers_index_url
    assert_response :success
  end

  test "should get show" do
    get layers_show_url
    assert_response :success
  end

  test "should get search" do
    get layers_search_url
    assert_response :success
  end

end
