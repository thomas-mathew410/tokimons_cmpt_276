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
  .get('/', (req, res) => res.render('pages/landing'))
  .get('/landingpage', (req, res) => res.render('pages/landing'))
  .get('/add', (req, res) => res.render('pages/addnew'))
  // .get('/landingpage', (req, res) => res.sendfile(path.join(__dirname+'/views/pages/landing.ejs')))
  // .get('/db', async (req, res) => {
  //   try {
  //     const client = await pool.connect()
  //     const result = await client.query('SELECT * FROM test_table');
  //     const results = { 'results': (result) ? result.rows : null};
  //     res.render('pages/db', results );
  //     client.release();
  //   } catch (err) {
  //     console.error(err);
  //     res.send("Error " + err);
  //   }
  // })

  .get('/Tokimons', (req,res) => {
    var getUsersQuery = `SELECT * FROM Tokimon`;
    // console.log(getUsersQuery);
    pool.query(getUsersQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows': result.rows };
      // res.json(result.rows);
      // console.log(results);
      res.render('pages/users', results)
    });
  })  
  
  .post('/add', (req,res) => {
    var total = parseInt(`${req.body["tokimonWeight"]}`) + parseInt(`${req.body["tokimonHeight"]}`) + parseInt(`${req.body["tokimonFly"]}`) + parseInt(`${req.body["tokimonFight"]}`) + parseInt(`${req.body["tokimonFire"]}`) + parseInt(`${req.body["tokimonWater"]}`) + parseInt(`${req.body["tokimonElectric"]}`) + parseInt(`${req.body["tokimonFrozen"]}`);
    var addTokiQuery = `INSERT INTO Tokimon (t_name, t_weight, t_height, t_fly, t_fight, t_fire, t_water, t_electric, t_frozen, t_trainer, t_total, t_desc) VALUES ('${req.body["tokimonName"]}', '${req.body["tokimonWeight"]}', '${req.body["tokimonHeight"]}', '${req.body["tokimonFly"]}', '${req.body["tokimonFight"]}', '${req.body["tokimonFire"]}', '${req.body["tokimonWater"]}', '${req.body["tokimonElectric"]}', '${req.body["tokimonFrozen"]}', '${req.body["tokimonTrainer"]}', '${total}', '${req.body["tokimonDescription"]}') RETURNING id`;
    console.log(addTokiQuery);
    pool.query(addTokiQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows': result.rows };

      // res.send(`${results.rows.forEach((r) => {r.id})}`);
      // console.log(results);
      res.redirect(301, `/Tokimons`);
    });
  })

  .post('/delete', (req,res) => {
    // var searchTokiQuery = `SELECT * FROM Tokimon WHERE id='${req.body["tokiID"]}'`;
    // var deletedResults = new Object();
    // pool.query(searchTokiQuery, (error, result) => {
    //   if (error)
    //     res.end(error);
    //   console.log('Hello');
    //   deletedResults = {'rows': result.rows };
    //   // res.json(deletedResults)
    // });
    
    var deleteTokiQuery = `DELETE FROM Tokimon WHERE id='${req.body["tokiID"]}'`;
    console.log(deleteTokiQuery);
    pool.query(deleteTokiQuery, (error) => {
      if (error)
        res.end(error);
      console.log('Hello');
      res.redirect(301, `/Tokimons`);
    });
    // res.send(`POST request to the homepage ${deletedResults}`)
    // res.render('pages/delete', deletedResults);
  })

  .get('/selectToModify', (req, res) => res.redirect(301, `/Tokimons`)) //To handle any refresh
  .post('/selectToModify', (req,res) => {
    var searchTokiQuery = `SELECT * FROM Tokimon WHERE id='${req.body["tokiID"]}'`;
    // var searchResults = new Object();
    pool.query(searchTokiQuery, (error, result) => {
      if (error)
        res.end(error);
      console.log('Hello post method /select modify');
      var searchResults = {'rows': result.rows };
      res.render('pages/modify', searchResults);
      });
  })

  .get('/modify', (req, res) => res.redirect(301, `/Tokimons`)) //To handle any refresh

  .post('/modify', (req,res) => {
    var total = parseInt(`${req.body["tokimonWeight"]}`) + parseInt(`${req.body["tokimonHeight"]}`) + parseInt(`${req.body["tokimonFly"]}`) + parseInt(`${req.body["tokimonFight"]}`) + parseInt(`${req.body["tokimonFire"]}`) + parseInt(`${req.body["tokimonWater"]}`) + parseInt(`${req.body["tokimonElectric"]}`) + parseInt(`${req.body["tokimonFrozen"]}`);
    var updateTokiQuery = `UPDATE Tokimon SET t_name='${req.body["tokimonName"]}', t_weight='${req.body["tokimonWeight"]}', t_height='${req.body["tokimonHeight"]}', t_fly='${req.body["tokimonFly"]}', t_fight='${req.body["tokimonFight"]}', t_fire='${req.body["tokimonFire"]}', t_water='${req.body["tokimonWater"]}', t_electric='${req.body["tokimonElectric"]}', t_frozen='${req.body["tokimonFrozen"]}', t_trainer='${req.body["tokimonTrainer"]}', t_total='${total}', t_desc='${req.body["tokimonDescription"]}' WHERE id='${req.body["tokimonID"]}'`;
    console.log(updateTokiQuery);
    pool.query(updateTokiQuery, (error) => {
      if (error)
        res.end(error);
      // console.log('Hello');
      // res.render('pages/update', updateResults)
      // res.redirect(301, `/users/${req.body["tokimonID"]}`);
      res.redirect(301, `/Tokimons`);
    });
    // var searchTokiQuery = `SELECT * FROM Tokimon WHERE id='${req.body["#tokiID"]}'`;
    // // var searchResults = new Object(); 
    // pool.query(searchTokiQuery, (error, result) => {
    //   if (error)
    //     res.end(error);
    //   var searchResults = {'rows': result.rows };
    //   res.render('pages/afterUpdate', searchResults)
    // });
  })

  // .get('/users/:id', (req,res) => {
  //   console.log(req.params.id);
  //   var userIDQuery = `SELECT * FROM Tokimon WHERE id='${req.params.id}'`;
  //   res.send('USER');
  // })
  
  .get('/moreinfo', (req, res) => res.redirect(301, `/Tokimons`)) //To handle any refresh

  .post('/moreinfo', (req,res) => {
    var searchTokiQuery = `SELECT * FROM Tokimon WHERE id='${req.body["tokiID"]}'`;
    // var searchResults = new Object();
    pool.query(searchTokiQuery, (error, result) => {
      if (error)
        res.end(error);
      var searchResults = {'rows': result.rows };
      res.render('pages/moreinfo', searchResults);
      });
  })
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
