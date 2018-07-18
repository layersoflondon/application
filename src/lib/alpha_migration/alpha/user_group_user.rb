module Alpha
  class UserGroupUser < ActiveRecord::Base
  include DatabaseConnection
    include AASM

    belongs_to :user
    belongs_to :user_group

    validates :user, :user_group, presence: true
    validates :user, uniqueness: {scope: [:user_group_id, :invitation_state], message: "already a member of this group"}

    aasm column: :invitation_state do
      state :invited, initial: true # user is invited to a group (this is the pending state)
      state :accepted, :rejected, :group_rejected # user accepted or rejected their invite, or the group rejected a user wanting to join their group
      state :requested # user has requested membership to a group
      state :removed # user was removed from a group

      event :accept do
        transitions from: :invited, to: :accepted
      end

      event :accept_request do
        transitions from: :requested, to: :accepted
      end

      event :reject do
        transitions from: :invited, to: :rejected
      end

      event :permit do
        transitions from: :requested, to: :accepted
      end

      event :reject_request do
        transitions from: :requested, to: :group_rejected
      end

      event :request_invite do
        transitions from: :invited, to: :requested
      end

      event :remove do
        transitions from: :accepted, to: :removed
      end
    end
  end
end

