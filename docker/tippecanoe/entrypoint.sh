#!/bin/bash

set -e
find /data/*.geojson | xargs /usr/local/bin/tippecanoe --force -e /public/polygons