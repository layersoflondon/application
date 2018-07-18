# see https://www.railsmachine.com/articles/2017/05/19/converting-a-rails-database-to-utf8mb4.html
# we use Module.prepend because alias_method_chain doesn't work now.
module CreateTableWithRowFormat
  extend ActiveSupport::Concern
  def create_table(table_name, options = {})
    table_options = options.reverse_merge(:options => 'ENGINE=InnoDB ROW_FORMAT=DYNAMIC')

    super(table_name, table_options) do |td|
      yield td if block_given?
    end
  end
end
ActiveSupport.on_load :active_record do
  ActiveRecord::ConnectionAdapters::AbstractMysqlAdapter.prepend(CreateTableWithRowFormat)
end
