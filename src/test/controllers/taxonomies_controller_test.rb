require 'test_helper'

class TaxonomiesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get taxonomies_index_url
    assert_response :success
  end

end
