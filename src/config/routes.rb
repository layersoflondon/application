Rails.application.routes.draw do


  get 'posts/show'
  get 'events/show'
  root to: "pages#index"

  get '/user/teams', to: 'user#teams'
  get '/user/record_collections'

  devise_for :users,
             controllers: {
               invitations: 'users/invitations',
               sessions: 'users/sessions',
               unlocks: 'users/unlocks',
               passwords: 'users/passwords',
               registrations: 'users/registrations'
             }, skip: [:invitations] # TODO do we need the invitation routes or are we creating the invitations manually in the controller?


  get '/user/:id/teams', to: 'user_teams#index'

  resources :records, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :attachments, controller: 'record_attachments', only: %i[index create show update destroy]
    member do
      patch 'like'
    end
  end

  resources :collections, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :records, controller: 'collection_records', only: %i[index create destroy]
  end

  post '/teams/join', to: 'teams#request_to_join_team'
  resources :teams, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :users, controller: 'team_users', only: %i[index create show update destroy]
  end

  get '/teams/:id/accept-request', to: 'teams#accept_request'
  get '/teams/:id/deny-request', to: 'teams#deny_request'

  post '/teams/:id/invite-user', to: 'teams#invite_user'
  get '/teams/:id/accept-invitation', to: 'teams#accept_invitation'

  post '/teams/:id/leave', to: 'teams#leave'

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

  resources :events, only: [:show], path: "events"
  resources :posts, only: [:show], path: "posts"

  match 'search', via: [:get, :post], to: 'search#index', defaults: {format: :json}

  # IMPORTANT: this is a greedy catchall route - it needs to be the last route in the file.
  #         # IMPORTANT: this is a greedy catchall route - it needs to be the last route in the file.
  match "/*nested_path(.:extension)", via: [:get], to: "pages#show", as: :page, constraints: ->(request) { request.path.exclude?('rails/active_storage') && (request.format == :html || request.format == '*/*') }
end
