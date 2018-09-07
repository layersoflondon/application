# Server configuration. For a simple site this is just one entry.
role :app, %w{deployment@lol-web01.hosts.errorstudio.com}
role :web, %w{deployment@lol-web01.hosts.errorstudio.com}
role :db, %w{deployment@lol-web01.hosts.errorstudio.com}

# Git branch
set :branch, 'development'

#the base domain for this site - is appended to the primary domain for a prelaunch url
set :base_domain, "prelaunch.error.agency"

# the prelaunch domain
set :prelaunch_domain, ->{"staging.layersoflondon.org"}

#domains which this site will answer to (i.e. not redirect)
set :site_domains, ['staging.layersoflondon.org']
#redirects domains to the primary domain as a 301
set :domain_redirects, %w()

#rewrites in nginx format - useful for specifying hard-coded urls for redirection after launch

set :custom_nginx_rules, [
  "add_header X-LoL-Backend $hostname;"
]

set :path_redirects, {

}

set :url_rewrites, {}

set :nginx_custom_server_context, ""

# set the deploy domain to the prelaunch domain
set :deploy_domain, fetch(:prelaunch_domain)

set :passenger_port, 8003
set :passenger_max_pool_size, 20
set :passenger_min_instances, 5

#SSL settings
set :ssl_required, true
set :ssl_dir, File.join(File.dirname(__FILE__),"ssl")
set :ssl_cert, "layersoflondon.org.crt"
set :ssl_key, "layersoflondon.org.key.gpg" #this should be a gpg-encrypted key
set :ssl_dh, "dhparams.pem.gpg" #this should be a gpg-encrypted key


set :basic_auth_required, true
set :basic_auth_username, 'lol'
set :basic_auth_password, 'lolstaging'
