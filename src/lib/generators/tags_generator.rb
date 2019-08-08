class TagsGenerator < ::Rails::Generators::Base
  desc "Create predefined list of tags if none exist"

  def create_tags
    tags = {"Crime and punishment and the Law" => [
      "Law courts",
      "Police and Policing",
      "Prisons",
      "Workhouses"],
            "Education" => [
              "Education reform",
              "Libraries",
              "Schools",
              "Technical education",
              "Universities"],
            "Health" => [
              "Ambulance Services",
              "Child health",
              "Disease and mortality",
              "Hospitals/clinics",
              "Mental health"],
            "Housing, Infrastructure and Environment" => [
              "Animals",
              "Archaeology",
              "Bridges",
              "Canals",
              "Cemeteries",
              "Docks",
              "Forests",
              "Geology",
              "Green belt",
              "Housing estates",
              "Municipal buildings",
              "Palaces and castles",
              "Parks and gardens",
              "Residential squares",
              "River Thames",
              "Rivers (other)",
              "Shopping centres",
              "Tall buildings",
              "The Fire Brigade",
              "Transport systems "],

            "Politics & government" => [
              "Boroughs",
              "Ceremonial and ritual",
              "City of London",
              "LCC, GLC, GLA",
              "Manors",
              "Planning",
              "Political parties",
              "Popular movements",
              "Protest marches and demonstrations",
              "Riots and disorder",
              "Suffrage campaigns"],
            "Religion & worship" => [
              "Fraternities and religious associations",
              "Places of worship",
              "Religious communities/denominations"],
            "Sport, leisure and popular culture" => [
              "Art and artistic movements",
              "Cinema",
              "Clubbing",
              "Clubs, associations, community groups",
              "Exhibitions",
              "Fairs",
              "Festivals and Carnivals",
              "Music",
              "Sports clubs and grounds",
              "Theatre"],
            "Trade, Industry and commerce" => [
              "Farming",
              "Financial services and banking",
              "Guilds/livery companies",
              "Manufacturing",
              "Markets",
              "Merchants",
              "Newspapers",
              "Restaurants, street food and cafés",
              "Shopping and retail"],
            "Transport" => [
              "Air",
              "Road",
              "Rail",
              "Water"],
            "Visual evidence " => [
              "Art",
              "Maps and Plans",
              "Film/video"],
            "Written evidence " => [
              "Customs",
              "Diaries and personal records",
              "Documentary records",
              "Literature",
              "Myths and legends"],
            "War & conflict" => [
              "Battles",
              "Civil defence infrastructure",
              "English Civil War",
              "WW1",
              "WW2"],
            "Gender, ethnicity and identity" => [
              "Community groups and institutions",
              "Language and culture",
              "LGBTQ",
              "Migration"],
            "Lost London" => [
              "War Damage",
              "Lost buildings/places",
              "Destroyed by natural disasters",
              "Ways of life and culture"
            ],
            "Imagined or Future London" => [
              "Projects not implemented",
              "Fictional London",
              "Future London"
            ]

    }

    tags.each do |group, tags|
      tag_group = TagGroup.find_or_create_by(name: group.strip)
      tags.each do |tag|
        Tag.find_or_create_by(tag_group: tag_group, name: tag.strip)
      end
    end


  end
end