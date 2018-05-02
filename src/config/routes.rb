Rails.application.routes.draw do
  get '/user/teams', to: 'user_teams#index'
  get '/user/record_collections'

  devise_for :users,
             controllers: {
               invitations: 'users/invitations',
               sessions: 'users/sessions',
               unlocks: 'users/unlocks',
               passwords: 'users/passwords',
               registrations: 'users/registrations'
             }, skip: [:invitations] # TODO do we need the invitation routes or are we creating the invitations manually in the controller?

  resources :user, only: %i[] do
    resources :teams , only: %i[index], defaults: {format: :json}
  end

  resources :records, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :attachments, controller: 'record_attachments', only: %i[index create show update destroy]
  end

  resources :collections, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :records, controller: 'collection_records', only: %i[index create destroy]
  end

  post '/teams/join', to: 'teams#request_to_join_team'
  resources :teams, only: %i[index create show update destroy], defaults: {format: :json} do
    resources :users, controller: 'team_users', only: %i[index create show update destroy]
  end



  resource :map do
    match "/*nested_path(.:extension)", via: [:get], to: "map#show", as: :page
  end
end
