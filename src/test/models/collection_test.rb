require 'test_helper'

class CollectionTest < ActiveSupport::TestCase
  def setup
    @collection = Collection.new(
        title: 'some title',
        description: 'some description',
        attachment_id: 1,
        read_state: 'public_read',
        write_state: 'creator',
        creator_id: 1
    )
  end

  test 'valid collection' do
    assert @collection.valid?
  end

  test 'add record from collection' do
    # I would prefer to get the fixtures from the test db but doesn't works so far the method .find(1)
    # not sure how works this yet
    @collection.save
    @collection.records.create(
        title: 'some title',
        description: 'some description',
        state: "published",
        lat: 11,
        lng: 22,
        date: "2018-03-02"
    )
  end
end
