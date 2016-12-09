class PagesController < ApplicationController
  include Rooftop::Rails::NestedResource
  nested_rooftop_resource :page
  decorates_assigned :page, with: PageDecorator

  prepend_before_action :redirect_page_if_required, only: :show
  prepend_before_action :find_and_validate_page, only: :show

  before_action :get_map_content, if: -> {params[:nested_path]=="the-map"}

  layout :determine_layout

  # This is the homepage. We're assuming that the slug is 'home'
  def index
    @page = Page.find_by(slug: "home").first
    get_homepage_content
  end

  # This is the method used to render every page on the site except the homepage
  def show
  end


  private

  def get_map_content
    @pins        = Pin.latest.group_by(&:coords)
    @overlays    = Overlay.all.select{|o| o.overlay_type.name=="tileserver"}
    @collections = {}
    @places      = []

    @data = render_to_string('maps/search', layout: false, formats: [:json])
  end

  # If there's a redirect required, do that instead of rendering.
  def redirect_page_if_required
    if @page.redirect?
      redirect_to @page.fields.redirect_url and return
    end
  end

  # Determine which layout to show, assuming a standardised approach of having a templates folder under layouts with all the templates in, named as underscored versions of the Rooftop template names.
  def determine_layout
    if action_name == "index"
      "templates/homepage"
    else
      if @page.present? && @page.template.present? && template_exists?(@page.template.underscore,File.join("layouts/templates"))
        "templates/#{@page.template.underscore}"
      else
        "templates/content_page"
      end
    end
  end

  def get_homepage_content
    # This is where you put homepage-specific stuff - usually other calls to Rooftop which you assign to instance variables.
  end


end
