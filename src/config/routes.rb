Rails.application.routes.draw do
  resources :records
  resources :collections do
    resources :records, controller: 'collection_records'
  end
end