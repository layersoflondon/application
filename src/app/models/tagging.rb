class Tagging < ApplicationRecord

  belongs_to :tagger, polymorphic: true
  belongs_to :tag
  
end
