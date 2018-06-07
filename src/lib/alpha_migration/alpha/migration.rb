module Alpha
  class Migration
    def self.perform
      alpha_pins = Alpha::Pin.includes(pin_content_entry: {content_entry: :content_type}).references(pin_content_entry: {content_entry: :content_type})

    end
  end
end