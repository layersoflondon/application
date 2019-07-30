import React from 'react';
import { Map, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import _ from 'leaflet-draw';
import { inject, observer } from 'mobx-react/index';
import { NavLink, withRouter } from 'react-router-dom';

@withRouter
@inject('mapToolsStore')
@observer
export default class MapView extends React.Component {
    constructor(props) {
        super(props);

        this.setMapRef = element => {
            this.props.mapToolsStore.mapRef = element;
        };
    }

    handleOnClick(event) {
        if(this.props.match.params.lat && this.props.match.params.lng) return false;

        const {lat, lng} = event.latlng;
        this.props.history.push(`/maptools/squares/${lat},${lng}`);
    }

    componentDidMount() {
        // const count = 3;
        // const mapHeight = 800;
        // const mapWidth  = 800;
        // const cursor = {x: 0, y: mapHeight};
        // const cellWidth  = mapWidth / count;
        // const cellHeight = mapHeight / count;
        //
        // const coordinates = [];
        //
        // let tlX, tlY, trX, trY,
        //     blX, blY, brX, brY;
        // for( let iy = 0 ; iy < count ; iy++) {
        //     for( let ix = 0 ; ix < count ; ix++) {
        //         tlX = blX = cursor.x;
        //         tlY = trY = cursor.y;
        //         trX = brX = cursor.x + cellWidth;
        //         brY = blY = cursor.y - cellHeight;
        //
        //         let cell = [
        //             [tlX, tlY], [trX, trY], [brX, brY], [blX, blY], [tlX, tlY]
        //         ];
        //
        //         coordinates.push(cell);
        //
        //         cursor.x = cursor.x + cellWidth;
        //     }
        //
        //     cursor.x = 0;
        //     cursor.y = cursor.y - cellHeight;
        // }
        //
        // const grid = {
        //     type: 'FeatureCollection',
        //     features: [
        //         {
        //             type: 'Feature',
        //             geometry: {
        //                 type: 'MultiPolygon',
        //                 coordinates: [coordinates]
        //             }
        //         }
        //     ]
        // }
        //
        // L.geoJson(grid).addTo(this.mapRef.current.leafletElement);
        // const coordsToKey = (coords) => `${coords.x}:${coords.y}:${coords.z}`;
        //
        // const grid = new LeafletVirtualGrid({cellSize: 50});
        // const rects = {};
        //
        // window.grid = grid;
        // window.rects = rects;
        //
        // grid.on('cellcreate', (event) => {
        //     const bounds = Object.values(event.bounds);
        //
        //     const rect = L.rectangle(bounds, {
        //         color: '#3ac1f0',
        //         weight: 1,
        //         opacity: 0.1,
        //         fillOpacity: 0.5,
        //         fill: '#f2f2f2'
        //     }).addTo(this.mapRef.current.leafletElement);
        //
        //     rects[coordsToKey(event.coords)] = rect;
        // });
        //
        // grid.on("cellleave", (event) => {
        //     const rect = rects[coordsToKey(event.coords)];
        //     this.mapRef.current.leafletElement.removeLayer(rect);
        // });
        //
        // grid.on('cellenter', (event) => {
        //     const rect = rects[coordsToKey(event.coords)];
        //     this.mapRef.current.leafletElement.addLayer(rect);
        // });
        //
        // grid.addTo(this.mapRef.current.leafletElement)

        // Add the drawing controls to the map instance
        const drawnItems = L.featureGroup().addTo(this.props.mapToolsStore.mapRef.leafletElement);

        const drawingControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                poly: {
                    allowIntersection: false,
                    showArea: true
                }
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true
                }
            }
        });

        this.props.mapToolsStore.mapRef.leafletElement.addControl(drawingControl);
        this.props.mapToolsStore.mapRef.leafletElement.editableItems = drawnItems;

        this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.CREATED, (event) => {
            const layer = event.layer;
            const data = layer.toGeoJSON();
            if( layer.toGeoJSON().geometry.type === "Point" ) {
                data.properties = {...data.properties, radius: layer.getRadius()}
            }

            this.props.mapToolsStore.createFeature(1, data);
        });

        this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.EDITED, (event) => {
            event.layers.eachLayer((layer) => {
                const data = layer.toGeoJSON();
                if( layer.toGeoJSON().geometry.type === "Point" ) {
                    data.properties = {...data.properties, radius: layer.getRadius()}
                }

                this.props.mapToolsStore.updateFeature(1, layer.properties.id, data);
            });
        });

        this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.DELETED, (event) => {
            event.layers.eachLayer((layer) => {
                this.props.mapToolsStore.deleteFeature(1, layer.properties.id);
            });
        });
    }

    componentWillMount() {
        setTimeout(() => {
            this.props.mapToolsStore.setPolygons();
        }, 50);
    }

    render() {
        let zoom = this.props.match.params.lat ? 17 : 9;
        const mapPosition = !!(this.props.match.params.lat && this.props.match.params.lng);

        let center = [51.5074, 0.1278];
        let draggingEnabled = true;
        let zoomingEnabled  = true;
        let zoomControl = <ZoomControl position={`topleft`} />;

        let canEdit = false;

        if(this.props.match.params.lat && this.props.match.params.lng) {
            // draggingEnabled = false;
            // zoomingEnabled  = false;
            // zoomControl     = true;
            center = [parseFloat(this.props.match.params.lat), parseFloat(this.props.match.params.lng)];
            canEdit = true;
        }else if( this.props.match.path.search(/\/1$/)>-1 ) {
            zoom = 17;
            center = [51.51066556016948,0.12187957763671876]
        }

        return <div>
            {mapPosition &&
                <NavLink to={this.props.match.url.substring(0, this.props.match.url.lastIndexOf('/'))}>Back</NavLink>
            }

            <div className="m-map-area" style={{marginTop: 200, left: 0, width: '800px', height: '800px', marginLeft: '10px', bottom: '10px'}}>
                <Map onClick={this.handleOnClick.bind(this)} ref={this.setMapRef} zoomControl={zoomControl} center={center} zoom={zoom} dragging={draggingEnabled} touchZoom={zoomingEnabled} doubleClickZoom={zoomingEnabled} scrollWheelZoom={zoomingEnabled}>
                    <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03" attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
                </Map>
            </div>
        </div>
    }
}