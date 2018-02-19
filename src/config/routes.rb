Rails.application.routes.draw do
  resource :map

  root 'map#index'
end
