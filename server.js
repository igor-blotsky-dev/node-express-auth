const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

let corsOptions = {
  origin: "http:localhost:8081"
}


app.use(cors(corsOptions))



/* db */

const db = require('./models')
const Role = db.role

db.mongoose.connect(
  `mongodb://admin:admin0@ds131546.mlab.com:31546/auth-test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('Successfully connect to MongoDB')
  initial()
}).catch(err => {
  console.error('Connection error', err)
  process.exit()
})



/* /db */

// test route
app.get('/', (req, res) => {
  res.json({
    message: 'welcome'
  })
})

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}