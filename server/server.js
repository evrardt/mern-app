const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const mongoose = require('mongoose');

const serverConfig = require('./serverConfig');
const config = serverConfig[process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'];
let mongoUser = "";
if (config.db.user) {
  mongoUser = config.db.user+':'+config.db.password+'@';
}
let mongoUrl = 'mongodb://'+mongoUser+config.db.host+':'+config.db.port+'/'+config.db.database;

mongoose.connect(mongoUrl, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, '> Database connection on '+mongoUrl+' failed:'));
db.once('open', function() {
  console.log('> Database connection on '+mongoUrl+' sucessfull');
});

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    
    server.use('/api/photos', require('./routes/index'));

    server.get('*', (req, res) => {
      return handle(req, res)
    });

    server.listen(config.server.port, err => {
      if (err) throw err
      console.log('> WebServer connection on http://'+config.server.host+':'+config.server.port+' sucessfull');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
