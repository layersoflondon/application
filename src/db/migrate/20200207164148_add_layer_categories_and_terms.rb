class AddLayerCategoriesAndTerms < ActiveRecord::Migration[5.2]
  def up
    ["London Maps", "Borough Maps", "Datasets"].each do |category|
      LayerCategory.create(name: category)
    end

    boroughs = LayerCategory.find_by(name: "Borough Maps")
    
    ["City of London", "Barking and Dagenham", "Barnet", "Bexley", "Brent", "Bromley", "Camden", "Croydon", "Ealing", 
    "Enfield", "Greenwich", "Hackney", "Hammersmith and Fulham", "Haringey", "Harrow", "Havering", "Hillingdon", 
    "Hounslow", "Islington", "Kensington and Chelsea", "Kingston upon Thames", "Lambeth", "Lewisham", "Merton", "Newham", 
    "Redbridge", "Richmond upon Thames", "Southwark", "Sutton", "Tower Hamlets", "Waltham Forest", "Wandsworth", "Westminster"].each do |term|
      LayerTerm.create(name: term, layer_category: boroughs)
    end
  end

  def down
    LayerCategory.destroy_all
    LayerTerm.destroy_all
  end
end
