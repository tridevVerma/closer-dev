// *********** Connecting to mongoose and create DB **********
const mongoose = require('mongoose');
const env = require('../config/environment');

mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://${env.mongodb_domain_name}:${env.mongodb_port}/${env.db_name}`,{
    useNewUrlParser: true,
  });
  console.log("Successfully connected to database")
}