Rails.application.routes.draw do
  mount LayersOfLondon::Booth::MapTool::Engine => "/layers_of_london-booth-map_tool"
end
