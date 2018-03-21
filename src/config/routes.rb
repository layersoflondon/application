Rails.application.routes.draw do
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