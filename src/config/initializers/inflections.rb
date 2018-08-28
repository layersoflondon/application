# Be sure to restart your server when you modify this file.

# Add new inflection rules using the following format. Inflections
# are locale specific, and you may define rules for as many different
# locales as you wish. All of these examples are active by default:
ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.uncountable %w( geodata )
end



# These inflection rules are supported but not enabled by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.acronym 'RESTful'
# end

ActiveSupport::Inflector.inflections(:en) do |inflect|
  # when we build a Attachments::Geodata class ("Attachments::#{'geodata'}")
  # prevent Rails from using the class Attachments::Geodatum...
  inflect.singular /geodata/, 'geodata'
end
