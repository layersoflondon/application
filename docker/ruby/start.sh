#!/bin/sh

yarn install

rm /app/tmp/pids/server.pid

rails s -p 3000 -b '0.0.0.0'