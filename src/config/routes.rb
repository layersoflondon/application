Rails.application.routes.draw do
  devise_for :users,
             controllers: {
               invitations: 'users/invitations',
               sessions: 'users/sessions',
               unlocks: 'users/unlocks',
               passwords: 'users/passwords',
               registrations: 'users/registrations'
             }, skip: [:invitations] #TODO do we need the invitation routes or are we creating the invitations manually in the controller?
  resources :records, only: %i[index create show update destroy] do
    resources :images, controller: 'record_images', only: %i[index create show update destroy], defaults: {type: :json}
    resources :documents, controller: 'record_documents', only: %i[index create show update destroy], defaults: {type: :json}
    resources :attachments, controller: 'record_attachments', only: %i[index create show update destroy], defaults: {type: :json}
  end
  resources :collections, only: %i[index create show update destroy] do
    resources :records, controller: 'collection_records', only: %i[index create destroy], defaults: {type: :json}
  end
  resources :teams, only: %i[index create show update destroy], defaults: {type: :json}
end