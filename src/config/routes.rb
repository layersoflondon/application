Rails.application.routes.draw do


  # Alpha redirects
  get '/map/pins/:id', to: redirect('/map/records/%{id}')
  get '/the-map', to: redirect('/map')
  get '/search', to: redirect('/map/search')


  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  get 'posts/show'
  get 'events/show'
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



  resources :records, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :attachments, controller: 'record_attachments', only: %i[index create show update destroy]
    member do
      patch 'like'
    end
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



  resource :map, controller: 'maps' do
    match '/state', via: :get, to: 'maps#state', as: :map_state, format: :json
    match "/*resource/:action_name/:id(.:extension)", via: [:get], to: "maps#show", as: :resource_action
    match "/*resource/:id(.:extension)", via: [:get], to: "maps#show", as: :resource
    match "/*resource(.:extension)", via: [:get], to: "maps#show", as: :resources
  end

  resources :layers, only: [:index, :show], defaults: {format: :json} do
    get 'search', on: :collection
  end

  resources :taxonomies, only: [:index], defaults: {format: :json}

  resources :faqs, only: [:show], path: "faqs"
  resources :posts, only: [:show], path: "news-events"

  match 'search', via: [:get, :post], to: 'search#index', defaults: {format: :json}

  mount Rooftop::Rails::Engine => "/rooftop"

  # IMPORTANT: this is a greedy catchall route - it needs to be the last route in the file.
  #         # IMPORTANT: this is a greedy catchall route - it needs to be the last route in the file.
  match "/*nested_path(.:extension)", via: [:get], to: "pages#show", as: :page, constraints: ->(request) { request.path.exclude?('rails/active_storage') && (request.format == :html || request.format == '*/*') }
end
