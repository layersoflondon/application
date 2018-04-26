#!/bin/sh
#BUNDLE_PATH=/gems
# install yarn dependencies
bundle check || bundle install
yarn install
# launch the server
bundle exec ./bin/webpack-dev-server
#while true; do sleep 1; done