LayersOfLondon::Booth::MapTool::Engine.routes.draw do
  scope '/booth' do
    get 'session', to: '/layers_of_london/booth/map_tool/application#session'
    resource :maptools, only: [:show] do

      resources :squares, only: [:index, :show, :update] do
        collection do
          get :polygons
          get :grid
          get :coordinates
        end

        resources :polygons, except: [:new]
      end
    end
  end
end
