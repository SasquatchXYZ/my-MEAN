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
  rl.on('SIGINT', () => process.emit('SIGINT'));
  rl.on('SIGUSR2', () => process.emit('SIGUSR2'));
  rl.on('SIGTERM', () => process.emit('SIGTERM'))
}

mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${dbURI}`));
mongoose.connection.on('error', err => console.log(`Mongoose connection error: ${err}`));
mongoose.connection.on('disconnected', () => console.log(`Mongoose Disconnected`));

const gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose Disconnected through: ${msg}`);
    cb()
  })
};

// For Nodemon Restart
process.once('SIGUSR2', () => {
  gracefulShutdown('Nodemon Restart', () => {
    process.kill(process.pid, 'SIGUSR2')
  })
});

// For App Termination
process.on('SIGINT', () => {
  gracefulShutdown('App Termination', () => {
    process.exit(0)
  })
});

// For Heroku App Termination
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku App Shutdown', () => {
    process.exit(0)
  })
});

require('./locations');