module Alpha
  class PinContentEntry < ActiveRecord::Base
  include DatabaseConnection
    belongs_to :pin, inverse_of: :pin_content_entry
    belongs_to :content_entry, inverse_of: :pin_content_entry
    accepts_nested_attributes_for :content_entry

    validates :pin, uniqueness: {scipe: :content_entry, message: "A content entry can only be associated with one pin"}
  end
end

