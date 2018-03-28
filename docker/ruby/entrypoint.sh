#!/bin/sh

# migrate db if necessary
rails db:migrate
bundle exec rails s -p 3000 -b '0.0.0.0' -e development
