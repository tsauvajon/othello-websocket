var app = require('express')();
var server = require('http').createServer(app);
var swig = require('swig');
var path = require('path');

//setup view engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// server + routing
server.listen(3000)
app.get('/', function (req,res) {
  res.render('index');
});

var io = require('socket.io')(server);
// test
io.on('connection', function (socket) {
  socket.emit('server:event', { test: 'bjr'});
  socket.on('client:event', function (data) {
    console.log(data);
  });
});


// default react-create-app template

// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
//
// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <div className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h2>Welcome to React</h2>
//         </div>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }
//
// export default App;
