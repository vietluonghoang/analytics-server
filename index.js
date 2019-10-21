const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 5000
const db = require('./views/pages/db/queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
  )
// app
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .get('/db', async (req, res) => {
//     try {
//       const client = await pool.connect()
//       const result = await client.query('SELECT * FROM test_table');
//       const results = { 'results': (result) ? result.rows : null};
//       res.render('pages/db', results );
//       client.release();
//     } catch (err) {
//       console.error(err);
//       res.send("Error " + err);
//     }
//   })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

// app.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })
// app.get('/users/:id', db.getUserById)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

// view home page
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/', (req, res) => res.render('pages/index'))

//view analytics page
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/analytics/view', db.viewAnalytics)
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/analytics/view/:id', db.viewAnalytics)

//view analytics app_open
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/analytics/view/app_open', db.viewAnalyticsAppopen)
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/analytics/view/app_open/:id', db.viewAnalyticsAppopen)

//view analytics view_phantich
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/analytics/view/view_phantich', db.viewAnalyticsViewphantich)
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/analytics/view/view_phantich/:id', db.viewAnalyticsViewphantich)

//log analytics enpoint
app.post('/analytics', db.addAnalytics)

//get app configuration enpoint
app.get('/getConfig',db.getAppConfig)

//view Phantich page
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/phantich/view', db.viewPhantich)
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/phantich/view/:id', db.viewPhantich)

//get phantich enpoint
app.get('/phantich/getPhantich',db.getPhantich)

//redeemcoupon enpoint
app.post('/redeemcoupon', db.redeemAdsOptoutCoupon)

//get check Ads-optout enpoint
app.post('/hasoptout',db.hasOptoutAds)

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})