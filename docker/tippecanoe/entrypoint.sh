#!/bin/bash

set -e
rm -rf /out/booth-tiles
find /in/*.geojson | xargs /usr/local/bin/tippecanoe --force -z 18 -x square --drop-densest-as-needed -e /out