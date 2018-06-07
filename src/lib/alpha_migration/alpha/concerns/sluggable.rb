module Sluggable
  extend ActiveSupport::Concern

  included do
    validates :slug, uniqueness: true
    validates :slug, presence: true

    before_validation -> {
      generate_slug unless persisted?
    }

    before_save -> {
      generate_slug unless slug.present?
    }
  end

  def generate_slug
    self.slug = name.squish.parameterize
  end
end