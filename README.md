# Layers of London Application
This is the repository of code for the Layers of London application, which will live at http://www.layersoflondon.org

Tech stack:
* Ruby: 2.5.0p0
* Rails: 5.2.0.rc1
* Mysql: 5.7
* Redis: 3.2
* Elasticsearch: 6.2.1

###  Steps to run the project

Add to your `/etc/hosts` file, the following line:

```
127.0.0.1      webpack
```
Spin up the containers

```bash
$ docker-compose up -d
```

Known issue: 

* When spin up containers for first time with `docker-compose up -d`, the migration in the entrypoint of the ruby service, might fail since the mysql service didn't finish the warm up. Solved by running `docker-compose up -d` again

Hit http://localhost:3000/

Elastic search is composed independently, to spin up the elastic search container run:

```bash
$ docker-compose -f docker-compose.elk.yml up -d
```
Known issues:

 * Max virtual memory areas vm.max_map_count is too low, change it for amount suggested: `sudo sysctl -w vm.max_map_count=SUGGESTED_AMOUNT`
 
### Setup pre-commit

```bash
./src/scripts/setup-pre-commit.sh
```
This script add pre-commit file to the git directory

### Tests

BDD with Postman collections and newman

```bash
docker-compose exec -T ruby newman run LoL.postman_collection.json --globals LoL.postman_globals.json --environment Local.postman_environment.json
```

Mocha tests

```bash
docker-compose exec ruby rails RAILS_ENV=test db:reset
docker-compose exec ruby yarn run test
```


### Development

#### Setup remote interpreter

File > Settings > Languages & Frameworks > Ruby SDK and Gems > + > Select interpreter Path > New remote > Configure Remote Ruby interpreter > Dockerfile

# Licence

The project is licenced GPL3
