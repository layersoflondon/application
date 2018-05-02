#!/bin/sh
#BUNDLE_PATH=/gems

chmod 400 /home/app/.ssh/id_rsa

# install yarn dependencies
bundle check || bundle install
yarn install
# launch the server
bundle exec ./bin/webpack-dev-server
#while true; do sleep 1; done