require 'bcrypt'
# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# create 10 records that aren’t in a collection
record_states = %w[draft published pending_review flagged deleted]
collection_read_state = %w[public_read private_read]
collection_write_state = %w[everyone team creator]
team_user_role = %w[leader contributor]
layer_type = %w[georeferenced_image dataset polygon]

# Create user test
password = 123456
user_test = User.create(
    :email                 => 'test@error.agency',
    :password              => password,
    :password_confirmation => password,
    :encrypted_password    => BCrypt::Password.create(password).to_s
)

9.times do |_i|
  User.create(
      :email                 => "test#{_i + 2}@error.agency",
      :password              => password,
      :password_confirmation => password,
      :encrypted_password    => BCrypt::Password.create(password).to_s
  )
end


5.times do |_i|

  taxonomy_term = TaxonomyTerm.create(
      name: Faker::DragonBall.character,
      taxonomy: Taxonomy.create(
          name: Faker::Pokemon.name,
          description: Faker::ChuckNorris.fact
      )
  )

  record = Record.create(
      title: Faker::Company.catch_phrase,
      description: Faker::Company.bs,
      state: record_states[rand(0..3)],
      lat: rand(51.400..51.700),
      lng: (-1 + rand(0.80..1.00)).round(2),
      date_from: Faker::Date.between(10.year.ago, Date.today),
      user: user_test,
      location: {:address => Faker::Address.street_address},
      attachments_attributes:[{
            attachment_type: 'url',
            attachable_attributes: {
                title: Faker::Company.catch_phrase,
                caption: Faker::DragonBall.character,
                credit: Faker::Simpsons.character,
                url: Faker::Internet.url
            }
        }]
      )

  record.taxonomy_terms << taxonomy_term
end

# create teams
5.times do |_i|
  team = Team.create(
      name: Faker::Team.name,
      description: Faker::Company.bs
  )
  team.team_users << TeamUser.new(
      user: user_test,
      role: team_user_role[rand(0..1)],
      state: 'access_granted'
  )
end

team = Team.create(
    name: Faker::Team.name,
    description: Faker::Company.bs
)
team.team_users << TeamUser.new(
    user: user_test,
    role: team_user_role[rand(0..1)],
    state: 'access_granted'
)

# Create collections
5.times do |_i|

  user_team = [user_test, team]
  random_number = rand(0..2)

  collection = Collection.create(
      title: Faker::Company.catch_phrase,
      description: Faker::Company.bs,
      read_state: collection_read_state[rand(0..1)],
      write_state: collection_write_state[random_number],
      write_state_team_id: if random_number == 1 then team.id else nil end,
      owner: user_team[Faker::Number.between(0, 1)],
  )
  # Create collection records
  5.times do |_ri|
    collection.records << Record.create(
        title: Faker::Company.catch_phrase,
        description: Faker::Company.bs,
        state: record_states[rand(0..3)],
        lat: rand(51.400..51.700),
        lng: (-1 + rand(0.80..1.00)).round(2),
        date_from: Faker::Date.between(10.year.ago, Date.today),
        user: user_test,
        location: {:address => Faker::Address.street_address}
    )
  end
end

# create teams
5.times do |_i|
  team = Team.create(
      name: Faker::Team.name,
      description: Faker::Company.bs
  )
  team.team_users << TeamUser.new(user: user_test, role: 'leader', state: 'access_granted')
end

# create layers
5.times do |_i|

  layer_data  = [
      :georeferencer_table_id => '1OktmAP9za7OkU7l2VUf8yY-hf0bgCTg8VrNjvk0o',
      :tileserver_url => 'http://georeferencer-0.tileserver.com/5678017802d5d23499ada6924aff9c417da0a58b/map/{entity_id}/polynomial/{z}/{x}/{y}.png'
  ]

  Layer.create(
      title: Faker::Company.catch_phrase,
      description: Faker::Company.bs,
      lat: rand(51.400..51.700),
      lng: (-1 + rand(0.80..1.00)).round(2),
      date_from: Faker::Date.between(10.year.ago, Date.today),
      date_to: Faker::Date.between(5.year.ago, Date.today),
      layer_type: 'georeferenced_image',
      layer_data: layer_data[0].as_json
  )
end
