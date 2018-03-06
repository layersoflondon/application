#!/bin/sh

# install yarn dependencies
yarn install
# install gems
bundle install
# setup ssh
cat /opt/debugging/debugger.pub > /root/.ssh/authorized_keys # @TODO: fix auth type key pair, isn't working
chmod 600 /root/.ssh/authorized_keys
service ssh start
# migrate db (should schema.rb ignored?)
rails db:migrate
# remote pid
rm -rf tmp/pids/server.pid
bundle exec rails s -p 3000 -b '0.0.0.0' -e development