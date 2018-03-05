#!/bin/sh

yarn install

cat /opt/debugging/debugger.pub > /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
service ssh start

bundle exec rails s -p 3000 -b '0.0.0.0' -e development