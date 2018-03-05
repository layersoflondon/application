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

# Licence

The project is licenced GPL3
