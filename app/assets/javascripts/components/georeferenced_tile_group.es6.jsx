const LayerGroup = ReactLeaflet.LayerGroup;
class GeoreferencedTileGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = _.merge({},props,{image_data: []});
  }

  componentDidMount() {
    overlay = new GeoreferencedOverlay(this.props.georeferencer_table_id);
    window.theOverlay = overlay;
    overlay.getImageData().then(rows => {
      this.setState({image_data: rows})
    });

  }

  render() {
    return (
      <LayerGroup>
       {
         this.state.image_data.map((image_item_data) => {
           let sw = L.latLng(...image_item_data.south_west.split(","));
           let ne = L.latLng(...image_item_data.north_east.split(","));
           let bounds = L.latLngBounds(sw, ne);
           return <TileLayer key={image_item_data.georeferencer_id} url={this.props.tileserver_url} opacity={0.75} entity_id={image_item_data.georeferencer_id} reuseTiles={true} bounds={bounds}></TileLayer>;
         })
       }
     </LayerGroup>
    )
  }

}