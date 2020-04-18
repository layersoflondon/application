#!/bin/bash

set -e
rm -rf /out/booth-tiles
find /in/*.geojson | xargs /usr/local/bin/tippecanoe --no-tile-compression --force -z 18 -e /out