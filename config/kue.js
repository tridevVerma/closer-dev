// *********** Create memory queue to store jobs **********
const kue = require('kue');
const queue = kue.createQueue();

module.exports = queue;