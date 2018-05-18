# Basic details
set :application, 'application'
set :repo_url, 'git@github.com:layersoflondon/application'
set :repo_tree, 'src'
set :primary_domain, "beta.layersoflondon.org"
set :db_encoding, 'utf8mb4'
set :linked_dirs, fetch(:linked_dirs, []).push('node_modules')
#


