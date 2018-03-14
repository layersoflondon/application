require 'test_helper'

class RecordAttachmentsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get record_attachments_index_url
    assert_response :success
  end

  test "should get create" do
    get record_attachments_create_url
    assert_response :success
  end

  test "should get show" do
    get record_attachments_show_url
    assert_response :success
  end

  test "should get update" do
    get record_attachments_update_url
    assert_response :success
  end

  test "should get destroy" do
    get record_attachments_destroy_url
    assert_response :success
  end

end
