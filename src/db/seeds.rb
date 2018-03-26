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
record_states = %w[draft published pending_review flagged]
collection_read_state = %w[public_read private_read]
collection_write_state = %w[everyone team creator]

# Create user test
password = 123456
user_test = User.create(
    :email                 => 'test@error.agency',
    :password              => password,
    :password_confirmation => password,
    :encrypted_password    => BCrypt::Password.create(password).to_s
)
# Create another user test
User.create(
    :email                 => 'test2@error.agency',
    :password              => password,
    :password_confirmation => password,
    :encrypted_password    => BCrypt::Password.create(password).to_s
)

5.times do |_i|
  Record.create(
      title: Faker::Company.catch_phrase,
      description: Faker::Company.bs,
      state: record_states[Faker::Number.between(0, 3)],
      lat: Faker::Address.latitude,
      lng: Faker::Address.longitude,
      date: Faker::Date.between(10.year.ago, Date.today),
      user: user_test,
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
end

# Create collections
5.times do |_i|
  collection = Collection.create(
      title: Faker::Company.catch_phrase,
      description: Faker::Company.bs,
      read_state: collection_read_state[Faker::Number.between(0, 1)],
      write_state: collection_write_state[Faker::Number.between(0, 1)]
  )
  # Create collection records
  5.times do |_ri|
    collection.records << Record.create(
        title: Faker::Company.catch_phrase,
        description: Faker::Company.bs,
        state: record_states[Faker::Number.between(0, 3)],
        lat: Faker::Address.latitude,
        lng: Faker::Address.longitude,
        date: Faker::Date.between(10.year.ago, Date.today),
        user: user_test
    )
  end
end

# create teams
5.times do |_i|
  team = Team.create(
      name: Faker::Team.name,
      description: Faker::Company.bs
  )
  team.team_users << TeamUser.new(user: user_test, role: 'leader')
end
