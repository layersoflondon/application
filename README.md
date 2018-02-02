# Layers of London Application
This is the repository of code for the Layers of London application, which will live at http://www.layersoflondon.org

As the project progresses, we'll write more of a README file :-)

# Licence

The project is licenced GPL3

# Local Development 
## Dependencies
* Ruby ~> 2.5.0
* Rails ~> 5.2.0
* Nodejs
* Yarn
* Docker
    * MySQL
    * Redis
    * Elasticsearch (from docker.elastic.co)
* Kitematic (recommended, but optional)
* Overmind (or Hivemind, or Foreman)

Rubies are managed in the usual way, with RVM. 

### Tools

#### Ruby, Rails
* Ruby https://rvm.io / https://ruby-lang.org
* Rails https://rubyonrails.org
* Homebrew https://brew.sh

#### Homebrew tools
* brew install node
* brew install yarn
* brew install overmind (or hivemind)

#### Docker
Get the stable Docker image from here: 
https://docs.docker.com/docker-for-mac/install/#download-docker-for-mac 

#### Kitematic
Once docker is installed, install Kitematic from the dropdown menu item

## Setup

#### Docker
##### Create containers in Kitematic 
* Install the latest MySQL 5.6.* image  
    * Search for "MySQL"
    * Find the "Official" container
    * Click ... and change the selected tag from "latest" to "5.6.37"
    * Once installed, go to its settings tab in Kitematic and add an environment variable
        * Key ```MYSQL_ROOT_PASSWORD``` value ```root```
* Redis (use the latest official container)

##### Create ElasticSearch container  
_We install this manually as the ES container in the Docker repository is deprecated at version 5.*_ 

Pull the ES 6.1.3 docker image:  
```docker pull docker.elastic.co/elasticsearch/elasticsearch:6.1.3```

To create a container using this image:  
```
docker run --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.1.3
``` 

_You may be able to create the container using Kitematic, but due to an unknown issue it is currently broken - use the command line for now; your Elasticsearch container should appear in the sidebar)_


### Running the app
Since we're using a Procfile, we can spin up all of our processes and dependencies with one command:  
```overmind s```

Overmind will start each process in a tmux screen (tmux cheatsheet here: https://gist.github.com/MohamedAlaa/2961058).  
You can attach to a screen in a new terminal tab, using its name: 
```overmind c server``` (to connect to the 'server' process - you should see the usual Rails log output)

If any of your containers aren't currently running, they'll be started and the app should be able to use them on the ports they're bound to. 

_You cant attach to the docker instances as they dont run their processes on the host machine_

## Docker 
#### List running containers 
```docker ps```

#### List all containers 
`docker ps -a`

#### Attaching to a container
We can't use `overmind c` to connect to a docker process, we need to use docker itself.  

To access the `redis-cli` on the Redis container, just run:  
```docker exec -it redis redis-cli```

Similarly, you can start a bash session with:  
```docker exec -it redis bash```

To start a mysql console  
```docker exec -it mysql bash```  
```> mysql -uroot -proot ```  
_(use the root password we set in the MYSQL_ROOT_PASSWORD environment variable above)_  

#### Stopping our containers
```docker stop redis mysql elasticsearch```
