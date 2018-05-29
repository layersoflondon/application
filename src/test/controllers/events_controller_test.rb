require 'test_helper'

class EventsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get events_show_url
    assert_response :success
  end

end
