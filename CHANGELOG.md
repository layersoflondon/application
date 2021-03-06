Layers of London Changelog

This is a changelog of our development on the Layers of London application. Prior to release, this won't follow semantic versioning. It is designed to give an indication of progress rather than be the canonical information about every little change. For that, have a look at the [commit log](https://github.com/layersoflondon/application/commits/development).

# w/c 2018-07-16

- refactor images to load only when in the viewport, and show a spinner while loading. Makes the whole thing feel a lot faster.
- Use a basemap from Maptiler Cloud (Klokan)
- tune search queries and analysis
- import collections from Alpha
- import groups from Alpha
- records view now has a gallery of images
- add affordance on clicking one of the layers in the layer-chooser pane: there is a big tick now, and the layer tools are automatically open.
