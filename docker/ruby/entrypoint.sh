#!/bin/sh

# install yarn dependencies
yarn install

# setup
cat /opt/debugging/debugger.pub > /root/.ssh/authorized_keys # @TODO: fix auth type key pair, isn't working
chmod 600 /root/.ssh/authorized_keys
service ssh start

rails db:migrate

bundle exec rails s -p 3000 -b '0.0.0.0' -e development