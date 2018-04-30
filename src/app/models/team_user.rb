class TeamUser < ApplicationRecord
  include AASM

  enum state: %i[access_requested access_granted access_denied]

  aasm column: :state, enum: true do
    state :access_requested, initial: true
    state :access_granted
    state :access_denied

    event :mark_as_access_requested do
      transitions from: %i[access_requested], to: :access_requested
    end

    event :mark_as_access_granted do
      transitions from: %i[access_requested], to: :access_granted
    end

    event :mark_as_access_denied do
      transitions from: %i[access_requested access_granted], to: :access_denied
    end

  end

  belongs_to :team
  belongs_to :user

  enum role: %i[leader contributor]

end
