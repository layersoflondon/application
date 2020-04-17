#!/bin/bash

set -e
find /data/polygons/*.geojson | xargs /usr/local/bin/tippecanoe --force -e /public/polygons