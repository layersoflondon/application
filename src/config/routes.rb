Rails.application.routes.draw do
  resources :map, only: :show

  root "map#show"
end