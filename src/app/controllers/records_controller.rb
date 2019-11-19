class RecordsController < ApplicationController
  before_action :set_record, only: [:update, :destroy, :like, :report]
  skip_before_action :authenticate_user!, only: [:show, :index, :report, :for_user, :related]
  skip_after_action :verify_authorized, only: [:index, :show, :report, :for_user, :related] #show is in here because we authorize in the method

  after_action :increment_view_count, only: :show

  decorates_assigned :record, :records, with: RecordDecorator

  def index
    @records = RecordsIndex.filter(terms: {state: %w[published flagged]}).limit(500).order(created_at: :desc)
  end

  def create
    new_record_params = record_params

    # user is logged in through their teacher's account
    if session[:teacher_classroom_user].present?
      new_record_params[:added_by_student] = true
      new_record_params[:student_details] = session[:teacher_classroom_user]
    end

    begin
      @record = current_user.records.build(new_record_params)
    rescue ActiveRecord::MultiparameterAssignmentErrors
      @record = current_user.records.build(new_record_params.reject {|k,v| k.to_s.match(/^date_/)})
    end

    authorize(@record)
    @record.save # TODO horrible hack because we can't set the errors_on_publishing on create for some reason.
    @result = save_record_and_return_from_es(@record)

    unless @result.present?
      render json: @record.errors, status: :unprocessable_entity
    end
  end

  def show
    if user_signed_in?
      @record = RecordsIndex.in_state(['published','draft','flagged','pending_review']).filter(ids: {values: [params[:id]]}).first
    else
      @record = RecordsIndex.published.filter(ids: {values: [params[:id]]}).first
    end

    raise ActiveRecord::RecordNotFound, "Record not found" unless @record.present?
    raise Pundit::NotAuthorizedError unless RecordPolicy.new(current_user, @record).show?

    
    # TODO create a RecordViewJob which increments async.
    # @record.increment!(:view_count) unless cookies[:viewed_records].present? && cookies[:viewed_records].include?(@record.id)
  end

  def for_user
    raise Pundit::NotAuthorizedError unless UserRecordPolicy.new(current_user, Record).show?
    @records = RecordsIndex.user_records(
      user_id: params[:id],
      record_states: (current_user.try(:id) == params[:id].to_i) ? ['published', 'draft'] : ['published']
    )
  end

  def related
    record = RecordsIndex.published.filter(ids: {values: [params[:id]]}).first

    raise ActiveRecord::RecordNotFound, "Record not found" unless record.present?
    raise Pundit::NotAuthorizedError unless RecordPolicy.new(current_user, record).show?

    related = RecordsIndex.published.filter(ids: {values: record.related_record_ids}).limit(6)
    render json: related
  end

  def update
    check_transition(record_params[:state])

    begin
      @record.assign_attributes(record_params)
      @record.fix_dates(record_params) if @record.date_from_changed? || @record.date_to_changed?
    rescue ActiveRecord::MultiparameterAssignmentErrors
      @record.assign_attributes(record_params.reject {|k,v| k.to_s.match(/^date_/)})
    end

    @record.added_by_student = session[:teacher_classroom_user].present? # persisted attribute
    @record.record_added_by_current_student_user = session[:teacher_classroom_user].present? # attribute to determine what state to save the record in, depending on current user session
    authorize(@record)

    @result = save_record_and_return_from_es(@record)

    if @record.state == 'deleted' && @result == true
      return render json: '', status: :ok
    end
    
    unless @result.present?
      return render json: @record.errors, status: :unprocessable_entity
    end
  end

  def destroy
    authorize(@record)

    if @record.may_mark_as_deleted?
      @record.mark_as_deleted!
      render json: '', status: :ok
    else
      render json: @record.errors, status: :unprocessable_entity
    end
  end

  def like
    authorize(@record)
    @record.increment!(:like_count)

    current_user.record_likes << @record.id
    current_user.save if current_user.record_likes_changed?

    render json: {like_count: @record.reload.like_count}, status: 200
  end

  def report
    authorize(@record)

    user = current_user || User.find_by(email: record_report_params[:email])

    new_report_params = record_report_params.dup

    if user
      new_report_params[:user_id] = user.id
    else
      new_report_params[:email] = record_report_params[:email]
    end

    report = @record.record_reports.build(new_report_params)

    unless user || record_report_params[:email].present?
      report.errors.add(:email, "must be present")
    end

    if report.save
      render json: {id: @record.id}, status: :ok and return
    else
      render json: report.errors.full_messages, status: :unprocessable_entity and return
    end
  end

  def add_to_collections
    skip_authorization
    begin
      collection_ids = record_collection_params[:collection_ids] || []
      collection_ids.each do |id|
        cr = CollectionRecord.new(collection_id: id, record_id: record_collection_params[:id], contributing_user_id: current_user.id)
        raise Pundit::NotAuthorizedError unless CollectionRecordPolicy.new(current_user, cr).create?
        cr.save!
      end
      @result = save_record_and_return_from_es(Record.find(record_collection_params[:id]))
    rescue => e
      render json: {error: e}, status: :not_acceptable
    end

  end

  def remove_from_collections
    skip_authorization
    begin
      collection_ids = record_collection_params[:collection_ids] || []
      collection_ids.each do |id|
        cr = CollectionRecord.find_by(collection_id: id, record_id: record_collection_params[:id])
        next unless cr.present?
        raise Pundit::NotAuthorizedError unless CollectionRecordPolicy.new(current_user, cr).destroy?
        cr.destroy!
      end
      @result = save_record_and_return_from_es(Record.find(record_collection_params[:id]))
    rescue => e
      render json: {error: e}, status: :not_acceptable
    end
  end

  private

  def set_record
    @record = Record.find_by(id: params[:id])
    render json: '', status: :not_found unless @record
  end

  def record_params
    if request.patch?
      params.require(:record).permit(
        :state
      )
    else
      permitted = params.require(:record).permit(
        :title,
        :description,
        :state,
        :lat,
        :lng,
        :date_from,
        :date_to,
        :credit,
        :allow_team_editing,
        :team_id,
        tag_ids: [],
        location: %i[
          address
        ]
      )
      # dates are passed in as date_from(1i), date_from(2i), date_from(3i) and take advantage of Rails multiparameter assignment to put them back into a date.
      #
      # We don't require users to fill in all the parts, but we do need all the parts to create a proper date.
      #
      # If there is any part of the date, we will fill in the rest and record having done so in autogenerated_date_[from|to]_fields
      %w(date_from date_to).each do |date_field|
        autogenerated_field_name = "autogenerated_#{date_field}_fields"
        permitted[autogenerated_field_name] ||= []
        # reject any values which aren't numbers
        permitted.reject! {|k,v| k.match(%r{^#{date_field}}) && !v.to_s.match(/\d+/)}
        # check whether any part of the date is included
        if permitted.select {|k,v| k.match %r{^#{date_field}}}.values.any?(&:present?)
          # at least one part of the date is present; fill in the rest.
          [:year, :month, :date].each_with_index do |part, i|
            field_name = "#{date_field}(#{i+1}i)"
            unless permitted[field_name].present?
              permitted[field_name] = (part == :year) ? DateTime.now.year.to_s : "1"
              permitted[autogenerated_field_name] << part
            end
          end
        end
      end

      return permitted

    end
  end

  def record_report_params
    params.require(:report).permit(:issue, :message, :email, :comment_id)
  end

  def record_collection_params
    params.permit(:id, collection_ids: [])
  end

  def check_transition(state)
    case state
    when 'published'
      @record.mark_as_published
    when 'pending_review'
      @record.mark_as_pending_review
    when 'flagged'
      @record.mark_as_flagged
    when 'draft'
      @record.mark_as_draft
    when 'deleted'
      @record.mark_as_deleted
    end
  end

  def save_record_and_return_from_es(record)
    Chewy.strategy(:urgent) do
      if record.save
        return true if record.state === 'deleted'
        # Get the record from ES; it should be pretty quick but we have to check it's there
        filter = RecordsIndex.filter(ids: {values: [record.id]})
        loop do
          break if filter.count > 0
          sleep 0.1
        end
        return filter.first
      else
        nil
      end
    end
  end

  def check_user_can_publish_records(record)
    if session[:teacher_classroom_user] && current_user.teacher_token_expires < Time.now
      record.errors.add(:user, "Your classroom session has finished")
      nil
    end
  end

  def increment_view_count
    cookie = ActiveSupport::JSON.decode(cookies[:record_views]) rescue []
    
    unless cookie.include?(@record.id.to_i)
      cookie << @record.id
      cookies[:record_views] = {value: JSON.generate(cookie), expires: 1.year.from_now}

      Record.update_view_count!(@record.id)
    end
  end
end
