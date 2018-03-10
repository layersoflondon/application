Rails.application.routes.draw do
  resources :records, only: %i[index create show update destroy] do
    resources :images, controller: 'record_images', only: %i[index create show update destroy]
    resources :documents, controller: 'record_documents', only: %i[index create show update destroy]
  end
  resources :collections, only: %i[index create show update destroy] do
    resources :records, controller: 'collection_records', only: %i[index create destroy]
  end
  resources :teams, only: %i[index create show update destroy]
end