module HumapMigration
  class UserExporter
    USERS = User.all

    def self.export!(dir = nil)
      self.new.export!(dir)
    end

    def export!(dir = nil)
      count = USERS.count
      folder = dir ? File.expand_path(dir) : Rails.root.join("export", "users")
      puts "Exporting to #{folder}"
      FileUtils.mkdir_p(folder)
      USERS.all.each_with_index do |user, i|
        begin
          print "\r #{i + 1} / #{count}"
          file = File.join(folder, "#{user.id}.json")
          next if File.exists?(file)
          File.open(file, "w+") { |f| f.write data_for(user).to_json }
        rescue => e
          FileUtils.rm(file, force: true)
          $stderr.puts "Error exporting layer ID #{user.id}: #{e}"
          next
        end
      end
    end

    def data_for(user)
      data = (user.try(:attributes) || {}).except(:primary_image)
      data.merge!({teams: user.team_users.joins(:team).collect {|tu| tu.team.attributes.merge(state: tu.state)}})
      

      data
    end
  end
end