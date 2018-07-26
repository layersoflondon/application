class TeamUser < ApplicationRecord
  include AASM

  scope :leader, -> {
    where(role: :leader)
  }

  scope :contributor, -> {
    where(role: :contributor)
  }

  belongs_to :team
  belongs_to :user

  enum role: %i[leader contributor]

  aasm column: :state do
    state :access_requested, initial: true
    state :access_granted
    state :access_denied
    state :invited

    event :request_access do
      transitions from: %i[access_requested], to: :access_requested
    end

    event :grant_access do
      transitions from: %i[access_requested invited], to: :access_granted
    end

    event :deny_access do
      transitions from: %i[access_requested access_granted invited], to: :access_denied
    end

    event :mark_as_invited do
      transitions from: %i[access_requested], to: :invited
    end

  end
end
