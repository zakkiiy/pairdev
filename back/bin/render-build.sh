#!/usr/bin/env bash
# exit on error
set -o errexit
# bundle exec rake db:migrate ←コメントアウト
DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:migrate:reset