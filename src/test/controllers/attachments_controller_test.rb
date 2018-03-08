require 'test_helper'

class AttachmentsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get attachments_index_url
    assert_response :success
  end

  test "should get create" do
    get attachments_create_url
    assert_response :success
  end

  test "should get show" do
    get attachments_show_url
    assert_response :success
  end

  test "should get update" do
    get attachments_update_url
    assert_response :success
  end

  test "should get destroy" do
    get attachments_destroy_url
    assert_response :success
  end

end
