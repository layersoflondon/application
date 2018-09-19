import React,{Component} from 'react';
import Collection from '../../sources/collection';
import CollectionModel from '../../models/collection';

import Select from 'react-select'

import {observer, inject} from "mobx-react";

@observer export class AddToCollection extends Component {
  constructor(props) {
    super(props);

    this.selectRef = React.createRef();

    this.state = {
      showing: 'user_collections',
      collections: [],
      enabled_user_collections: [], // TODO this needs to be a list of user collections FOR THIS USER, ON THIS RECORD
      enabled_everyone_collections: [] // TODO this needs to be a list of everyone collections
    };
  }


}
