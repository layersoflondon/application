import React from 'react';
import {Map, TileLayer, ZoomControl, GeoJSON} from 'react-leaflet';
import _ from 'leaflet-draw';
import {inject, observer} from 'mobx-react/index';
import {NavLink, withRouter} from 'react-router-dom';

@inject('mapToolsStore')
@withRouter
@observer
export default class MapView extends React.Component {
  constructor(props) {
    super(props);

    this.setMapRef = element => {
      this.props.mapToolsStore.mapRef = element;
    };
  }

  handleOnClick(event) {
    if (this.props.location.pathname.search(/\/squares\/\d+/) === -1) {
      this.props.history.push(`/maptools/squares/1`);

      window.e = event;
      const centre = [event.lat, event.lng];
      this.props.mapToolsStore.setZoomAndCentre(18, centre)
    }
    window.theClick = event;
  }

  componentWillMount() {
    setTimeout(() => {
      this.initializeLeafletDrawingControlUI();
    }, 50);

    setTimeout(() => {
      this.props.mapToolsStore.setPolygons();
    }, 150);
  }

  initializeLeafletDrawingControlUI() {
    const editableItems = L.featureGroup().addTo(this.props.mapToolsStore.mapRef.leafletElement);
    const visibleItems = L.featureGroup().addTo(this.props.mapToolsStore.mapRef.leafletElement);

    const drawingControl = new L.Control.Draw({
      position: 'bottomleft',
      edit: {
        featureGroup: editableItems,
        poly: {
          allowIntersection: false,
          showArea: true,
          showLength: true
        },
        marker: false
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          guidelineDistance: 10,
          showLength: true
        },
        polyline: false,
        marker: false,
        circlemarker: false,
        rectangle: false,
        circle: false
      }
    });

    this.props.mapToolsStore.drawingControl = drawingControl;

    this.props.mapToolsStore.mapRef.leafletElement.editableItems = editableItems;
    this.props.mapToolsStore.mapRef.leafletElement.visibleItems = visibleItems;

    const squareId = () => {
      const locationId = this.props.location.pathname.match(/\/(\d+)/);
      return locationId.length > 1 ? parseInt(locationId[1], 10) : null;
    };

    this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      const data = layer.toGeoJSON();
      if (layer.toGeoJSON().geometry.type === "Point") {
        data.properties = {...data.properties, radius: layer.getRadius()}
      }

      this.props.mapToolsStore.createFeature(squareId(), data);
    });

    this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.EDITED, (event) => {
      event.layers.eachLayer((layer) => {
        const data = layer.toGeoJSON();

        if (layer.toGeoJSON().geometry.type === "Point") {
          data.properties = {...data.properties, radius: layer.getRadius()}
        }

        this.props.mapToolsStore.updateFeature(squareId(), layer.properties.id, data);
      });
    });

    this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.DELETED, (event) => {
      event.layers.eachLayer((layer) => {
        this.props.mapToolsStore.deleteFeature(squareId(), layer.properties.id);
      });
    });

    return drawingControl;
  }

//   generateGridForBounds(_bounds) {
//     //top left { lat: 51.56533312154746, lng: -0.2544021606445313 }
//     //bottom right { lat: 51.44994188705856, lng: 0.007896423339843752 }
//
//     // const bounds = {_northEast: { lat: 52.05840151921515, lng: 1.2304687500000002 }, _southWest: { lat: 50.95583160830687, lng: -0.9873962402343751 }};
//     //
//     // const northWest = [bounds._northEast.lat, bounds._southWest.lng];
//     // const southEast = [bounds._southWest.lat, bounds._northEast.lng];
//     //
//     // const coordinates = [[0.2103, 51.4858], [0.2110, 51.4858], [0.2115, 51.4888], [0.2103, 51.4858]];
//     //
//     // const grid = {
//     //     type: 'FeatureCollection',
//     //     features: [
//     //         {
//     //             type: 'Feature',
//     //             geometry: {
//     //                 type:  'Polygon',
//     //                 coordinates: [coordinates]
//     //             }
//     //         }
//     //     ]
//     // };
//     //
//     // console.log("grid", grid);
//     // return grid;
//
// //         var countX = 10; //cells by x
// //         var countY = 10; //cells by y
// //         var cellWidth = mapWidth / countX;
// //         var cellHeight = mapHeight / countY;
// //
// //         var coordinates = [],
// //           c = {x: 0, y: mapHeight}, //cursor
// //           //top-left/top-right/bottom-right/bottom-left
// //           tLx, tLy,   tRx, tRy,
// //           bRx, bRy,   bLx, bLy;
// //
// // // build coordinates array, from top-left to bottom-right
// // // count by row
// //         for(var iY = 0; iY < countY; iY++){
// //             // count by cell in row
// //             for(var iX = 0; iX < countX; iX++){
// //                 tLx = bLx = c.x;
// //                 tLy = tRy = c.y;
// //                 tRx = bRx =c.x + cellWidth;
// //                 bRy = bLy = c.y - cellHeight;
// //                 var cell = [
// //                     // top-left/top-right/bottom-right/bottom-left/top-left
// //                     [tLx, tLy], [tRx, tRy], [bRx, bRy], [bLx, bLy], [tLx, tLy]
// //                 ];
// //                 coordinates.push(cell);
// //                 // refresh cusror for cell
// //                 c.x = c.x + cellWidth;
// //             }
// //             // refresh cursor for row
// //             c.x = 0;
// //             c.y = c.y - cellHeight;
// //         }
// //
// //         var grid = {
// //             type: 'FeatureCollection',
// //             features: [
// //                 {
// //                     type: 'Feature',
// //                     geometry: {
// //                         type:  'MultiPolygon',
// //                         coordinates: [coordinates]
// //                     }
// //                 }
// //             ]
// //         };
// //
// //         return grid;
//
//     // return new Promise((resolve, reject) => {
//     //     setTimeout(() => {
//
//
//     const L = this.props.mapToolsStore.mapRef.leafletElement;
//     //get the topleft and bottom right of the area of the map, as a set of pixel points
//     const topLeft = L.project(this.props.mapToolsStore.NORTH_WEST, this.props.mapToolsStore.FULL_ZOOM);
//     const bottomRight = L.project(this.props.mapToolsStore.SOUTH_EAST, this.props.mapToolsStore.FULL_ZOOM);
//     console.log("topleft", topLeft, "bottomright", bottomRight);
//     // determine how many n-wide,n-high squares need to be created between the two (where n = the size of square we want - 850px
//     const countX = (bottomRight.x - topLeft.x) / this.props.mapToolsStore.DEFAULT_TILE_SIZE;
//     const countY = (bottomRight.y - topLeft.y) / this.props.mapToolsStore.DEFAULT_TILE_SIZE;
//
//     // the size of the tiles - n - in pixels
//     const cellWidth = this.props.mapToolsStore.DEFAULT_TILE_SIZE;
//     const cellHeight = this.props.mapToolsStore.DEFAULT_TILE_SIZE;
//
//     // the array we're building up of coordinates
//     let coordinates = [],
//
//       // cursor moving left to right, top to bottom
//       c = {x: topLeft.x, y: topLeft.y}, //cursor
//       //top-left/top-right/bottom-right/bottom-left
//       tLx, tLy, tRx, tRy, bRx, bRy, bLx, bLy;
//
//
//     for (let iY = 0; iY < countY; iY++) {
//       // count by cell in row
//       for (let iX = 0; iX < countX; iX++) {
//         tLx = bLx = c.x;
//         tLy = tRy = c.y;
//         tRx = bRx = c.x + cellWidth;
//         bRy = bLy = c.y + cellHeight;
//         let cell = [
//           // top-left/top-right/bottom-right/bottom-left/top-left
//           Object.values(L.unproject([tLx, tLy], L.getMaxZoom())),
//           Object.values(L.unproject([tRx, tRy], L.getMaxZoom())),
//           Object.values(L.unproject([bRx, bRy], L.getMaxZoom())),
//           Object.values(L.unproject([bLx, bLy], L.getMaxZoom())),
//           Object.values(L.unproject([tLx, tLy], L.getMaxZoom()))
//         ];
//         coordinates.push(cell);
//         // refresh cusror for cell
//         c.x = c.x + cellWidth;
//       }
//       // refresh cursor for row
//       c.x = topLeft.x;
//       c.y = c.y + cellHeight;
//     }
//
//     let data = {
//       type: 'FeatureCollection'
//     };
//
//
//     data.features = coordinates.map((polygon) => {
//       return {
//         type: 'Feature',
//         geometry: {
//           type: 'Polygon',
//           coordinates: [polygon]
//         }
//       }
//     });
//
//     return data
//
//
//
//
//
//   }


  render() {
    let draggingEnabled = true;
    let zoomingEnabled = true;


    return <React.Fragment>
      <div className="m-map-area" data-zoom={this.props.mapToolsStore.zoom}>
        <Map onClick={this.handleOnClick.bind(this)} ref={this.setMapRef} zoomControl={false}
             center={this.props.mapToolsStore.centre.toJS()} zoom={this.props.mapToolsStore.zoom}
             dragging={draggingEnabled} touchZoom={zoomingEnabled} doubleClickZoom={zoomingEnabled}
             scrollWheelZoom={zoomingEnabled}>
          <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03"
                     attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
          <TileLayer url="http://tiles.layersoflondon.org/booth/{z}/{x}/{y}.png"/>

          <GeoJSON data={this.props.mapToolsStore.squares}/>
        </Map>
      </div>
    </React.Fragment>
  }
}