const { connectKafka } = require('./kafka');
const { connectRabbit } = require('./rabbit');

function connect() {
  connectKafka();
  connectRabbit();
}

module.exports = {
  connect,
};
