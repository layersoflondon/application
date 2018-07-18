require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
  test "should get record_collections" do
    get user_record_collections_url
    assert_response :success
  end

end
