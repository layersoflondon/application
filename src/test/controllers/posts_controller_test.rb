require 'test_helper'

class PostsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get posts_show_url
    assert_response :success
  end

end
