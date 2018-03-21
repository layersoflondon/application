require 'test_helper'

class RecordTest < ActiveSupport::TestCase
   def setup
     @record = Record.new(
         title: 'some title',
         description: 'some description',
         state: "published",
         lat: 11,
         lng: 22,
         date: "2018-03-02"
     )
   end

   test 'valid record' do
     assert @record.valid?
   end

   test 'invalid record without title' do
     @record.title = nil
     refute @record.valid?, 'saved record without a title'
     assert_not_nil @record.errors[:title]
   end

   test 'invalid record title length less than three chars' do
     @record.title = '12'
     refute @record.valid?, 'saved record title length less than three chars'
     assert_not_nil @record.errors[:title]
   end

   test 'invalid record title length more than 255 chars' do
     @record.title = 'Ut at massa ac mauris euismod bibendum non vitae ipsum. Quisque a ultricies dolor. Ut sed volutpat tortor, in fermentum massa. Suspendisse convallis, erat eget consectetur posuere, eros mi faucibus lacus, id venenatis metus magna id elit. Maecenas accumsan lacinia est. Curabitur tristique ex diam. Praesent eu neque vitae dolor sollicitudin vehicula. Cras hendrerit metus nec rutrum efficitur. Integer blandit, nulla id feugiat bibendum, diam neque scelerisque lacus, nec vulputate justo arcu in felis. Vestibulum ligula massa, rhoncus at orci sagittis, gravida imperdiet mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
     refute @record.valid?, 'saved record title length more than 255 chars'
     assert_not_nil @record.errors[:title]
   end

   test 'invalid record description length less than three chars' do
     @record.description = '12'
     refute @record.valid?, 'saved record description length less than three chars'
     assert_not_nil @record.errors[:description]
   end

   test 'invalid record date is greater than today' do
     @record.date = Date.tomorrow.to_formatted_s(:db)
     refute @record.valid?, 'saved record date is greater than today'
     assert_not_nil @record.errors[:date]
   end
end
