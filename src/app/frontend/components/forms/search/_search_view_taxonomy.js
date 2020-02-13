import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer export default class SearchViewTaxonomy extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const taxonomy_name = this.props.taxonomy[0];
    const {title, terms} = this.props.taxonomy[1];

    const the_terms = Object.keys(terms).map(( key, index ) => {
      const {name, title} = terms[key];

      return <label key={index} htmlFor={taxonomy_name}>
        <input type="checkbox" name={taxonomy_name} value={name} onClick={this.props.toggleMethod} />
        <span>{title}</span>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
      </label>
    });

    return <div className="form-group form-group--checklist form-group--replaced-checkboxes">
      <h2 className="label">{title}</h2>
      {the_terms}
    </div>
  }
}
