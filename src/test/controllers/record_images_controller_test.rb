require 'test_helper'

class RecordImagesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get record_images_index_url
    assert_response :success
  end

  test "should get create" do
    get record_images_create_url
    assert_response :success
  end

  test "should get show" do
    get record_images_show_url
    assert_response :success
  end

  test "should get update" do
    get record_images_update_url
    assert_response :success
  end

  test "should get destroy" do
    get record_images_destroy_url
    assert_response :success
  end

end
