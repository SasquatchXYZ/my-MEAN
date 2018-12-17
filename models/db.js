const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

let dbURI = 'mongodb://localhost/Loc8r';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGODB_URI
}
mongoose.connect(dbURI, {useNewUrlParser: true});

const readLine = require('readline');
if (process.platform === 'win32') {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', function () {
    process.emit('SIGINT')
  });
  rl.on('SIGUSR2', function () {
    process.emit('SIGUSR2')
  });
  rl.on('SIGTERM', function () {
    process.emit('SIGTERM')
  })
}

mongoose.connection.on('connected', function () {
  console.log(`Mongoose connected to ${dbURI}`)
});

mongoose.connection.on('error', function (err) {
  console.log(`Mongoose connection error: ${err}`)
});

mongoose.connection.on('disconnected', function () {
  console.log(`Mongoose Disconnected`)
});

const gracefulShutdown = function (msg, cb) {
  mongoose.connection.close(function () {
    console.log(`Mongoose Disconnected through: ${msg}`);
    cb();
  })
};

// For Nodemon Restart
process.once('SIGUSR2', function () {
  gracefulShutdown('Nodemon Restart', function () {
    process.kill(process.pid, 'SIGUSR2')
  })
});

// For App Termination
process.on('SIGINT', function () {
  gracefulShutdown('App Termination', function () {
    process.exit(0)
  })
});

// For Heroku App Termination
process.on('SIGTERM', function () {
  gracefulShutdown('Heroku App Shutdown', function () {
    process.exit(0)
  })
});

require('./locations');