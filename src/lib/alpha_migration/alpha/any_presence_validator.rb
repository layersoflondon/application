module Alpha
  class AnyPresenceValidator < ActiveModel::Validator
    def validate(record)
      unless options[:fields].any?{|attr| record.send(attr).present?}
        record.errors.add(:base, "You need to include at least one of #{options[:fields].collect(&:to_s).to_sentence(last_word_connector: " or ")}")
      end
    end
  end
end

