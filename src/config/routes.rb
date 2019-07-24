Rails.application.routes.draw do
  # Robot gem renders env-specific robots.txt files
  mount_roboto

  # Alpha redirects
  get '/map/pins/:id', to: redirect('/map/records/%{id}')
  get '/the-map', to: redirect('/map')
  get '/search', to: redirect('/map/search')

  #Redirect for trailing slash on map
  get '/map/', to: redirect("/map"), constraints: ->(req) { req.original_fullpath == "/map/"}

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  get 'switch_user', to: 'switch_user#set_current_user'
  
  root to: "pages#index"

  get '/user/record_collections'
  devise_for :users,
             controllers: {
               invitations: 'users/invitations',
               sessions: 'users/sessions',
               unlocks: 'users/unlocks',
               passwords: 'users/passwords',
               registrations: 'users/registrations'
             }


  resources :users, only: [:show], defaults: {format: :json} do
    member do
      get 'records', to: "records#for_user", as: :records_for
      get 'collections', to: "collections#for_user", as: :collections_for

      patch 'switch_role', to: "users#switch_role", as: :switch_user_role
      post  'generate_token', to: "users#generate_token", as: :generate_token
      patch 'invalidate_current_token', to: "users#invalidate_current_token", as: :invalidate_current_token
    end
  end

  get '/classroom/:id', to: "users#classroom", as: :teacher_classroom
  post '/classroom/:id', to: "users#classroom_login", as: :teacher_classroom_login

  resources :records, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :attachments, controller: 'record_attachments', only: %i[index create show update destroy]
    member do
      patch 'like'
      post 'report'
      patch 'collections', to: 'records#add_to_collections'
      delete 'collections', to: 'records#remove_from_collections'
    end

    resources :comments, controller: 'comments', only: [:index, :create, :update, :destroy]
  end

  resources :collections, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :records, controller: 'collection_records', only: %i[index create destroy]
  end

  resources :teams do
    collection do
      post 'request_to_join', to: 'teams#request_to_join', as: :request_to_join
    end
    member do

      get 'accept_request', to: 'teams#accept_request', as: :accept_request_to_join
      get 'deny_request', to: 'teams#deny_request', as: :deny_request_to_join

      post 'invite', to: 'teams#invite_users', as: :invite_users_to
      get 'accept_invitation', to: 'teams#accept_invitation', as: :accept_invitation_to_join

      post 'leave', to: 'teams#leave', as: :leave

      post 'remove', to: 'teams#remove', as: :remove_from
    end
  end

  resources :georeferencer_projects, only: :show, path: 'layermaker'
  

  resource :map, controller: 'maps' do
    match '/state', via: :get, to: 'maps#state', as: :map_state, format: :json
    match "/*resource/:action_name/:id(.:extension)", via: [:get], to: "maps#show", as: :resource_action
    match "/*resource/:id(.:extension)", via: [:get], to: "maps#show", as: :resource
    match "/*resource(.:extension)", via: [:get], to: "maps#show", as: :resources
  end

  resources :layers, only: [:index, :show], defaults: {format: :json} do
    get 'search', on: :collection
    get 'export'
  end

  resources :taxonomies, only: [:index], defaults: {format: :json}

  resources :guides, only: [:show], path: "help-centre/guides"
  resources :faqs, :faq_entries, only: [:show], path: "help-centre/faqs"
  resources :posts, only: [:show], path: "news-events"

  match 'search', via: [:get, :post], to: 'search#index', defaults: {format: :json}

  mount Rooftop::Rails::Engine => "/rooftop"

  mount LayersOfLondon::Booth::MapTool::Engine => "/"

  resource :maptools, only: [:show] do
    resources :squares, except: [:show, :new, :destroy], controller: 'maptools' do
      collection do
        match ":id", via: [:get], to: "maptools#show", constraints: {id: /[0-9A-Za-z\-\.,]+/}
      end
    end
  end

  # IMPORTANT: this is a greedy catchall route - it needs to be the last route in the file.
  #         # IMPORTANT: this is a greedy catchall route - it needs to be the last route in the file.
  match "/*nested_path(.:extension)", via: [:get], to: "pages#show", as: :page, constraints: ->(request) {request.path.exclude?('rails/active_storage') && (request.format == :html || request.format == '*/*')}
end
