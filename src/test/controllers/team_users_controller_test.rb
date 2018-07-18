require 'test_helper'

class TeamUsersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get team_users_index_url
    assert_response :success
  end

  test "should get create" do
    get team_users_create_url
    assert_response :success
  end

  test "should get show" do
    get team_users_show_url
    assert_response :success
  end

  test "should get update" do
    get team_users_update_url
    assert_response :success
  end

  test "should get destroy" do
    get team_users_destroy_url
    assert_response :success
  end

end
