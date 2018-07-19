import React, {Component} from 'react';
import {observer, inject} from "mobx-react";
import 'mediaelement';

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore')
@observer export default class MediaElement extends Component {
  state = {};

  success(media, node, instance) {
    // Your action when media was successfully loaded
  }

  error(media) {
    // Your action when media had an error loading
  }

  render() {
    const props = this.props;
    const sources = props.sources, tracks = props.tracks, sourceTags = [], tracksTags = [];

    for (let i = 0, total = sources.length; i < total; i++) {
      const source = sources[i];
      sourceTags.push(`<source src="${source.src}" type="${source.type}">`);
    }

    for (let i = 0, total = tracks.length; i < total; i++) {
      const track = tracks[i];
      tracksTags.push(`<track src="${track.src}" kind="${track.kind}" srclang="${track.lang}"${(track.label ? ` label=${track.label}` : '')}>`);
    }

    const mediaBody = `${sourceTags.join("\n")} ${tracksTags.join("\n")}`,
      mediaHtml = props.mediaType === 'video' ?
        `<video id="${props.id}" width="${props.width}" height="${props.height}"${(props.poster ? ` poster=${props.poster}` : '')}
					${(props.controls ? ' controls' : '')}${(props.preload ? ` preload="${props.preload}"` : '')}>
					${mediaBody}
				</video>` :
        `<audio id="${props.id}" width="${props.width}" autoplay controls>
					${mediaBody}
				</audio>`
    ;

    return (<div className={`media-element ${props.mediaType}`} dangerouslySetInnerHTML={{__html: mediaHtml}}></div>);

  }

  componentDidMount() {
    const {MediaElementPlayer} = global;

    if (!MediaElementPlayer) {
      return;
    }

    const options = Object.assign({}, this.props.options, {
      // Read the Notes below for more explanation about how to set up the path for shims
      pluginPath: './static/media/',
      success: (media, node, instance) => this.success(media, node, instance),
      error: (media, node) => this.error(media, node)
    });

    // window.flvjs = flvjs;
    // window.Hls = hlsjs;
    this.setState({player: new MediaElementPlayer(this.props.id, options)});
  }

  componentWillUnmount() {
    if (this.state.player) {
      this.state.player.remove();
      this.setState({player: null});
    }
  }
}