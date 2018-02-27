#!/bin/sh

# Install yarn dependencies
$HOME/.yarn/bin/yarn install --pure-lockfile
exec "$@"