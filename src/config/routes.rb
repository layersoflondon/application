Rails.application.routes.draw do
  resources :demos, only: :show
end
