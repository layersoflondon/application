class TeamUser < ApplicationRecord
  include AASM

  enum role: %i[leader contributor]
  # enum state: {
  #     access_requested: 0,
  #     access_granted: 1,
  #     access_denied: 2,
  #     invited: 3
  # }

  aasm column: :state do
    state :access_requested, initial: true
    state :access_granted
    state :access_denied
    state :invited

    event :mark_as_access_requested do
      transitions from: %i[access_requested], to: :access_requested
    end

    event :mark_as_access_granted do
      transitions from: %i[access_requested invited], to: :access_granted
    end

    event :mark_as_access_denied do
      transitions from: %i[access_requested access_granted invited], to: :access_denied
    end

    event :mark_as_invited do
      transitions from: %i[access_requested], to: :invited
    end

  end

  belongs_to :team
  belongs_to :user
end
