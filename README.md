# Layers of London Application
This is the repository of code for the Layers of London application, which will live at http://www.layersoflondon.org

###  Steps to run the project

```bash
# Spin up containers
$ docker-compose up -d
# Run weback server
$ docker-compose run ruby bin/webpack-dev-server
```
Elastic search is composed independently, to spin up the elastic search container run:

```bash
$ docker-compose -f docker-compose.es.yml up -d 
```

Launch in browser http://localhost:3000/`

### Development

#### Setup remote interpreter

  ```bash
    # Get the Gateway of the ruby service container
    # run following command and find the value at the bottom of the output under 
    # "NetworkSettings" > "Networks" > "Gateway"
    docker inspect $(docker-compose ps -q ruby)
  ```
File > Settings > Languages & Frameworks > Ruby SDK and Gems
Under src folder add a new remote interpreter

```
Host: CONTAINER_GATEWAY_VALUE
Port: 2222
User name:root
Auth type: root
Ruby interpreter path: /usr/local/bin/ruby
```
# Licence

The project is licenced GPL3
