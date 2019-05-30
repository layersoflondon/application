namespace :lol do
  namespace :collections do
    desc "Fix collection team ownerships"
    task set_team_collection_owners: :environment do
      collections = Collection.where(write_state: 'team').where.not(owner_type: 'Team', write_state_team_id: nil)
      collections.each do |collection|
        collection.update_attributes({owner_type: 'Team', owner_id: collection.write_state_team_id})
      end
    end
  end
end
