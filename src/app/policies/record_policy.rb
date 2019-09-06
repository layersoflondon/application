class RecordPolicy < ApplicationPolicy
  def index?
    if record.published?
      true
    else
      user.present? && record.user_id == user.id
    end
  end

  def show?
    if record.state.in?(["published", "flagged"])
      true
    else
      update?
    end
  end

  def create?
    user.present? && record.user.try(:[],'id') == user.id
  end

  def update?
    create? || (record.allow_team_editing && user.present? && record.team_id.in?(user.team_ids))
  end

  def destroy?
    update?
  end

  def like?
    user.present? && !user.record_likes.include?(record.id)
  end

  def report?
    true
  end

  def related?
    show?
  end

  def subscribe_to_comments?
    user.present? && (user.in?(record.comment_thread_participants) || record.user == user)
  end

  def unsubscribe_from_comments?
    subscribe_to_comments?
  end


  class Scope < Scope
    def resolve
      scope
    end
  end
end
