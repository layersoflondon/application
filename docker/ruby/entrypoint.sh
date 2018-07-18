#!/bin/sh

#BUNDLE_PATH=/gems

# install yarn dependencies
bundle check || bundle install
yarn install
# migrate db if necessary 
bundle exec rails db:migrate # TODO: check whether mysql service is already running
# remove pre-existing server.pid file
rm -f tmp/pids/server.pid
# launch the server
bundle exec rails s -p 3000 -b '0.0.0.0'