const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost/todosdb_development');
  console.log("Successfully connected to database")
}