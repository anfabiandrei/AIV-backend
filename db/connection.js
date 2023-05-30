const mongoose = require('mongoose');

(async function connection() {
  console.log("Start connection to db...");  

  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error(err);
  }
})();