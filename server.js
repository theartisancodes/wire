const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mockMiddleware = require('./mock_endpoints/mockMiddleware');
const path = require('path');
const auth = require('./mock_endpoints/auth');
require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('./webpack.dev.js');
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      hot: true,
      publicPath: webpackConfig.output.publicPath
    })
  );
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.join(__dirname, '/')));
  app.use(bodyParser.json());

  // Incident routes
  app.get('/api/incidents', auth, mockMiddleware.fetchIncidents);
  app.get('/api/incidents/:id', auth, mockMiddleware.fetchIncident);
  app.put('/api/incidents/:id', auth, mockMiddleware.updateIncident);
  app.get('/api/search/incidents', auth, mockMiddleware.handleSearch);

  // Notes routes
  app.post('/api/incidents/:id/notes', mockMiddleware.addNoteToIncident);
  app.get('/api/incidents/:id/notes', mockMiddleware.fetchIncidentNotes);
  app.put('/api/notes/:id', mockMiddleware.editIncidentNote);
  app.delete('/api/notes/:id', mockMiddleware.archiveIncidentNote);

  // Chat routes
  app.post('/api/incidents/:id/chats', mockMiddleware.addChatToIncident);
  app.get('/api/incidents/:id/chats', mockMiddleware.fetchIncidentChats);
  app.put('/api/chats/:id', mockMiddleware.editIncidentChat);
  app.delete('/api/chats/:id', mockMiddleware.archiveIncidentChat);

  // Staff routes
  app.get('/api/users', mockMiddleware.fetchStaff);
  app.post('/api/users/invite', mockMiddleware.addUser);
  app.get('/api/users/search', mockMiddleware.searchUser);
  app.put('/api/users/:id', mockMiddleware.editUser);
  app.delete('/api/users/:id', mockMiddleware.deleteUser);

  // roles
  app.get('/api/roles', mockMiddleware.fetchRoles);

  // locations
  app.get('/api/locations', mockMiddleware.fetchLocations);

  // Login route
  app.post('/api/users/login', mockMiddleware.login);

  app.use('*', function(req, res, next) {
    let filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function(err, result) {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });

  app.use(function (err, req, res, next) {
    res.status(500).send('Something broke!');
  });
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  // Configuration for production environment
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

const server = app.listen(process.env.PORT || 8080, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
