# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# create 10 records that aren’t in a collection
recordStates = ["draft", "published", "pending_review", "flagged"]

collectionReadState = ["public_read", "private_read"]
collectionWriteState = ["everyone", "team", "creator"]

10.times do |i|
  Record.create(
      title: Faker::Company.catch_phrase,
      description: Faker::Company.bs,
      state: recordStates[Faker::Number.between(1, 3)],
      lat: Faker::Address.latitude,
      lng: Faker::Address.longitude,
      date: Faker::Date.between(10.year.ago, Date.today)
  )
end#

# create 3 collections
3.times do |i|
  collection = Collection.create(
      title: Faker::Company.catch_phrase,
      description: Faker::Company.bs,
      read_state: collectionReadState[Faker::Number.between(1, 3)],
      write_state: collectionWriteState[Faker::Number.between(1, 3)]
  )
  5.times do |ri|
    collection.records.create(
        title: Faker::Company.catch_phrase,
        description: Faker::Company.bs,
        state: recordStates[Faker::Number.between(1, 3)],
        lat: Faker::Address.latitude,
        lng: Faker::Address.longitude,
        date: Faker::Date.between(10.year.ago, Date.today)
    )
  end
end