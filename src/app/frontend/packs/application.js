/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import React,{Component} from 'react'
import ReactDOM from 'react-dom'

import Main from '../components/main';

document.addEventListener('DOMContentLoaded', () => {

  ReactDOM.render(<Main />, document.getElementById("map-root") );

  // const state = observable({
  //   count: 0
  // });
  // state.inc = function() {console.log(this); this.count++;};

  // class FooState {
  //   @observable count = 0;
  //
  //   inc() {
  //     this.count++;
  //   }
  // }
  //
  // @observer class Foo extends React.Component {
  //   render() {
  //     console.log("Rendering with ", this.props.store.count );
  //     return <div>
  //       count: {this.props.store.count}.
  //       <hr/>
  //
  //       <button onClick={this.props.store.inc.bind(this)}>+</button>
  //       <button onClick={this.props.store.inc}>++</button>
  //     </div>
  //   }
  // }
  //
  // const store = new FooState();
  // ReactDOM.render(<Foo store={store} />, document.getElementById("map-root"));
  // class Store {
  //   @observable todos = [{id: 1, title: "test 1", done: false}, {id: 2, title: "Hello world", done: false}];
  //   @observable filter = "";
  // }
  //
  // const store = window.store = new Store();

  // const store = observable({
  //   todos: [{id: 1, title: "test 1", done: false}, {id: 2, title: "Hello world", done: false}],
  //   filter: ""
  // });
  // window.store = store;
  //
  // @observer class ListItem extends React.Component {
  //   render() {
  //     return <div>
  //       <span>{this.props.todo.title}</span> - {this.props.todo.done ? 'done' : 'not done'}
  //     </div>
  //   }
  // }
  //
  // @observer class TodoList extends React.Component {
  //   render() {
  //     const todos = this.props.store.todos.map( (t) => {return <ListItem key={t.id} todo={t}/>});
  //
  //     return <div>
  //       <Devtools/>
  //       {todos}
  //     </div>
  //   }
  // }
  //
  // ReactDOM.render(<TodoList store={store} />, document.getElementById("map-root"));
});
