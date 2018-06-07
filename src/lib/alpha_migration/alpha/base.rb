module Alpha
  class Base < ActiveRecord::Base
    include DatabaseConnection
  end
end