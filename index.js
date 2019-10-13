const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({extended : false}))
  .use(bodyParser())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/landingpage', (req, res) => res.render('pages/landing'))
  .get('/add', (req, res) => res.render('pages/addnew'))
  // .get('/landingpage', (req, res) => res.sendfile(path.join(__dirname+'/views/pages/landing.ejs')))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/users', (req,res) => {
    var getUsersQuery = `SELECT * FROM Tokimon`;
    console.log(getUsersQuery);
    pool.query(getUsersQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows': result.rows };
      console.log(results);
      res.render('pages/users', results)
    });
  })  
  
  .post('/add', (req,res) => {
    var updateUsersQuery = `INSERT INTO Tokimon (t_name, t_weight, t_height, t_fly, t_fight, t_fire, t_water, t_electric, t_frozen, t_trainer) VALUES ('${req.body["tokimonName"]}', '${req.body["tokimonWeight"]}', '${req.body["tokimonHeight"]}', '${req.body["tokimonFly"]}', '${req.body["tokimonFight"]}', '${req.body["tokimonFire"]}', '${req.body["tokimonWater"]}', '${req.body["tokimonElectric"]}', '${req.body["tokimonFrozen"]}', '${req.body["tokimonTrainer"]}')`;
    console.log(updateUsersQuery);
    pool.query(updateUsersQuery, (error, result) => {
      if (error)
        res.end(error);
      console.log('Hello');
      var results = {'rows': result.rows };
      console.log(results);
      res.send('POST request to the homepage')
    });
  }) 
  

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
