Rails.application.routes.draw do
  get 'user_teams/index'
  root 'map#show'

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
  end

  resources :collections, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :records, controller: 'collection_records', only: %i[index create destroy]
  end

  post '/teams/join', to: 'teams#request_to_join_team'
  get '/teams/:id/accept-request', to: 'teams#accept_request'
  get '/teams/:id/deny-request', to: 'teams#deny_request'
  post '/teams/:id/invite-user', to: 'teams#invite_user'
  get '/teams/:id/accept-invitation', to: 'teams#accept_invitation'
  post '/teams/:id/leave', to: 'teams#leave'

  resources :teams, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :users, controller: 'team_users', only: %i[index create show update destroy]
  end
end
