class Record < ApplicationRecord
  include RecordsQuery
  include AASM
  include SortFields



  update_index('records#record') { self }
 
  has_many :collection_records, dependent: :destroy
  has_many :collections, through: :collection_records
  has_many :attachments, dependent: :destroy
  # update_index('attachments#attachment') { attachments }
  belongs_to :user
  update_index 'users#user' do
    previous_changes['user_id'] || user
  end
  has_one :primary_image, class_name: 'Attachments::Image', foreign_key: :id, primary_key: :primary_image_id
  has_many :record_taxonomy_terms, class_name: 'RecordTaxonomyTerm', dependent: :destroy
  has_many :taxonomy_terms, through: :record_taxonomy_terms
  belongs_to :credit_image, class_name: 'Attachments::Image', dependent: :destroy, optional: true

  accepts_nested_attributes_for :attachments, allow_destroy: true

  has_many :record_reports

  belongs_to :editing_team, class_name: 'Team', foreign_key: :team_id, optional: true

  validate :user_is_member_of_team

  validates :editing_team, presence: {message: "You need to choose a team if you want them to edit"}, if: -> {allow_team_editing}

  before_validation do
    self.editing_team = nil if !self.allow_team_editing
  end

  enum view_type: %i[gallery expanded]
  enum state: %i[draft published pending_review flagged deleted]
  serialize :location, Hash
  serialize :errors_on_publishing, Hash
  serialize :autogenerated_date_from_fields, Array
  serialize :autogenerated_date_to_fields, Array

  before_update -> {
    self.mark_as_pending_review if self.record_added_by_current_student_user && self.may_mark_as_pending_review?
  }


  validates :title, :state, presence: true
  with_options if: -> (r) { r.state == 'published' } do
    validates :title, presence: {message: "You need to add a title"}
    validates :date_from, presence: {message: "You need to add a date"}
    validates :state, presence: true
    validates :description, presence: {message: "You need to include a description"}
    validates :lat, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
    validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
    # validates_format_of :date_from, with: /\d{4}-\d{2}-\d{2}/, message: "Date isn't in day / month / year format"
    # validates_format_of :date_to, with: /\d{4}-\d{2}-\d{2}/, message: "End date isn't in day / month / year format", if: -> {date_to.present?}
    validate :date_is_in_the_past
  end

  validates :user, presence: true # , unless: ->(r) {r.orphan?}

  scope :orphan, -> {
    where(user: nil)
  }

  before_validation :clean_up_description
  before_validation :clean_up_credit

  default_scope  { where.not(state: :deleted)}
  
  before_validation :autogenerate_title, on: :create
  before_validation :check_autogenerated_title, on: :update

  attr_accessor :checking_validity_for_publishing
  before_validation :check_valid_for_publishing, unless: -> {checking_validity_for_publishing}
  attr_accessor :record_added_by_current_student_user

  after_save do
    if primary_image.nil? && attachments.image.any?
      attachments.image.first.attachable.set_as_only_primary!
    end

  end

  # check whether the record is valid for publishing. If it's not, we record what needs to happen to make it so
  def check_valid_for_publishing
    # Set a bool attr on the record so we can skip validation callbacks and avoid a loop
    self.checking_validity_for_publishing = true
    original_state = self.state
    self.state = 'published'
    validate
    error_attributes = {
      valid_for_publishing: errors.empty?,
      errors_on_publishing: errors.messages
    }
    persisted? ? self.update_columns(error_attributes) : self.assign_attributes(error_attributes)
    errors.clear

    self.state = original_state
    self.checking_validity_for_publishing = false
  end


  def clean_up_description
  #   the quill editor seems to leave loads of empty paragraph tags around the place. We'll just strip empty paras out before saving
    sanitized = ActionController::Base.helpers.sanitize(description, tags: %w(p br h1 h2 b strong em u strikethrough s d ul ol), attributes: %w(href))
    doc = Nokogiri::HTML.fragment(sanitized)
    # remove paras with a break inside
    doc.css("p>br:only-child").each {|br| br.parent.remove if br.parent.children.count == 1}
    # remove empty paras
    doc.css('p').select {|p| p.children.empty?}.each(&:remove)
    self.description = doc.to_html
  end

  def clean_up_credit
    sanitized = ActionController::Base.helpers.sanitize(credit, tags: %w(p a), attributes: %w(href))
    doc = Nokogiri::HTML.fragment(sanitized)
    # remove paras with a break inside
    doc.css("p>br:only-child").each {|br| br.parent.remove if br.parent.children.count == 1}
    # remove empty paras
    doc.css('p').select {|p| p.children.empty?}.each(&:remove)
    self.credit = doc.to_html
  end

  def autogenerate_title
    self.title = "My new record" unless title.present?
    self.has_autogenerated_title = true
  end

  def check_autogenerated_title
    self.has_autogenerated_title = false if title_changed?
  end

  def date_is_in_the_past
    errors.add(:date_from, 'Date is not in the past') if date_from.present? && Date.today < date_from
    errors.add(:date_to, 'End date is before start date') if date_from.present? && date_to.present? && date_from > date_to
  end

  aasm column: :state, enum: true do
    state :draft, initial: true
    state :published
    state :pending_review
    state :flagged
    state :deleted

    event :mark_as_draft do
      transitions from: %i[draft published pending_review flagged], to: :draft
    end

    event :mark_as_pending_review do
      transitions from: %i[draft flagged pending_review], to: :pending_review
    end

    event :mark_as_published do
      transitions from: %i[draft pending_review published flagged], to: :published
    end

    event :mark_as_flagged do
      transitions from: %i[pending_review published flagged], to: :flagged
    end

    event :mark_as_deleted do
      transitions from: %i[draft published pending_review flagged], to: :deleted
    end
  end

  def everyone_collections
    collections.where(write_state: 'everyone')
  end

  def user_collections
    collections.where(write_state: ['creator', 'team'])
  end

  def get_primary_image(fallback_to_first: true)
    if primary_image_id && primary_image
      primary_image
    end

    images = attachments.where(attachable_type: "Attachments::Image")
    image = images.select{|a| a.attachable.attachment.is_primary?}.first

    if !image && fallback_to_first
      images.first if fallback_to_first && !image
    else
      image
    end
  end

  def excerpt(max_length = 80)
    if description.present?
      ActionController::Base.helpers.strip_tags(description).truncate(max_length).html_safe
    else
      ""
    end
  end

  def user_name
    user.name
  end

  def fix_dates(params)
    %w(date_from date_to).each do |attribute|
      date = self.send(attribute)
      break unless self.send("#{attribute}_changed?")
      break if date.gregorian?

      fixed_date_attributes = params.to_h.sort.inject({}){|h, k| h[k.first] = k.last.to_i if k.first.match(/^#{attribute}/); h}
      begin
        new_date = Date.new(*fixed_date_attributes.values)
        self.send(:"#{attribute}=", new_date) if new_date != date
      rescue ArgumentError
        errors.add(attribute.to_sym, "is invalid")
      end
    end
  end

  private

  def user_is_member_of_team
    if editing_team.present? && !user.teams.include?(editing_team)
      errors[:team] << "must be one you're a member of"
    end
  end
end
