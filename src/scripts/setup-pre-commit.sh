#!/bin/sh

echo "*** Installing precommit ***"
cp src/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
