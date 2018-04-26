group_script = <<-SCRIPT
  sudo addgroup deployers
  sudo usermod -a -G deployers vagrant
SCRIPT

rvm_script = <<-SCRIPT
  cd /vagrant
  rvm install 2.5.1
  bundle
SCRIPT
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision "shell", inline: group_script
  config.vm.provision "chef_solo" do |chef|
    chef_path = File.expand_path(File.join("..", "..","chef"))
    chef.version = "12"
    chef.cookbooks_path = File.join(chef_path,'cookbooks')
    chef.data_bags_path = File.join(chef_path,'data_bags')
    chef.environments_path = File.join(chef_path,'environments')
    chef.roles_path = File.join(chef_path,'roles')
    chef.encrypted_data_bag_secret_key_path = File.join("~",".chef-secret")
    chef.environment = 'vagrant'
    chef.json = {
      "hosts_entries" => {
        "mysql" => "127.0.0.1",
        "redis" => "127.0.0.1"
      }
    }
    chef.add_role 'base'
    chef.add_role 'webserver'
    chef.add_role 'dbserver'
    chef.add_role 'redis'
  end


  config.vm.provision "shell", inline: rvm_script, privileged: false

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  # config.vm.network "forwarded_port", guest: 9200, host: 9200
  # config.vm.network "forwarded_port", guest: 6379, host: 6379


  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "10.123.123.124"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Set permissions on shared folder
  #config.vm.synced_folder "./", "/vagrant", mount_options: ["dmode=775,fmode=664"], type: 'nfs'
  config.vm.synced_folder "./src", "/vagrant", type: 'nfs'

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  config.ssh.forward_agent = true

  # Project/User specific hostname (will return directory_name-username)
  config.vm.hostname = "#{Dir.pwd.split(File::SEPARATOR).last.downcase.gsub(/_/,'-')}-#{ENV['USER']}"

  config.vm.provider "virtualbox" do |vb|
    # Don't boot with headless mode
    # vb.gui = true

    # Use VBoxManage to customize the VM. For example to change memory:
    vb.customize ["modifyvm", :id, "--memory", "2048"]
  end

  # Make sure the vagrant user is in the rvm group
  # config.vm.provision "shell", inline: "usermod -a -G rvm vagrant"
end