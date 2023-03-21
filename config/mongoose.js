const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todosdb_development',{
    useNewUrlParser: true,
  });
  console.log("Successfully connected to database")
}