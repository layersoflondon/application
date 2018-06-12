module Alpha
  class Pin < ActiveRecord::Base
    include DatabaseConnection
  
    include AASM
    belongs_to :user

    has_one :pin_content_entry, inverse_of: :pin, dependent: :destroy
    has_one :content_entry, through: :pin_content_entry
    accepts_nested_attributes_for :pin_content_entry

    has_many :collection_pins, dependent: :destroy, inverse_of: :pin
    has_many :collections, through: :collection_pins, inverse_of: :pins

    accepts_nested_attributes_for :collection_pins #... collection_pin_attributes: {collection_attributes: {name: "foo", description: "Bar"}} ...
    accepts_nested_attributes_for :collections     #... collection_attributes: {collection_id: 3} ...

    def build_collection(params = {}, opts = {})
      raise "what?"
      # params[:user_collection_attributes].merge!({user_id: user.id}) if params.has_key?(:user_collection_attributes)
      # self.send(:collection_pins_attributes=, {collection_attributes: params})
    end

    validates :title, :lat, :lng, :date_from, :user, presence: true

    scope :latest, -> {
      all.includes(:collections, :pin_content_entry, content_entry: [:content_type]).order(created_at: :desc)
    }

    def coords
      {lat: lat, lng: lng}
    end

    aasm do
      state :pending, initial: true
      state :accepted
      state :rejected
      state :flagged

      event :accept do
        transitions from: :pending, to: :accepted
      end

      event :reject do
        transitions from: [:pending, :accepted], to: :rejected
      end

      event :flag do
        transitions from: [:pending, :accepted, :rejected], to: :flagged
      end

    end

    after_initialize do
      # if self.content_type.is_a?(String)
      #   self.content_type = ContentType.find(name: self.content_type)
      # end
      #
      # if self.from_date.is_a?(String)
      #   self.from_date = DateTime.parse(self.from_date)
      # end
      #
      # if self.to_date.is_a?(String)
      #   self.to_date = DateTime.parse(self.to_date)
      # end

    end

  end
end

