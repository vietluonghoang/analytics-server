const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


const viewAnalytics = async (request, response) => {
  const id = request.params.id
  console.error("=+=+=ID: " + id);
  if (id == undefined) {
    try {
      // const result = await pool.query('SELECT * FROM user_info ORDER BY idforvendor, adsid');
      // console.log('raw result is ',result);
      const countPerUser = await pool.query('select adsid, count(adsid) as timesOfAction from user_info group by adsid order by timesOfAction desc');
      
      const results = {eventCountByUsers: (countPerUser) ? countPerUser.rows : null};
      // console.log('manipulated result is ',results);
      response.render('pages/view_analytics', results );
    } catch (err) {
      console.error(err);
      response.send("Error " + err);
    }
  }else{
    try{
      const actionDetailsByUser = await pool.query('SELECT * FROM user_info WHERE adsid = $1 order by collectiondate desc', [id])
      const results = {userDetails: (actionDetailsByUser) ? actionDetailsByUser.rows : null};
      response.render('pages/view_analytics_by_user', results );
    }catch (err){
      console.error(err);
      response.send("Error " + err);
    }
  }
}

const viewPhantich = async (request, response) => {
  const id = request.params.id
  if (id == undefined) {
    try {
      // const result = await pool.query('SELECT * FROM user_info ORDER BY idforvendor, adsid');
      // console.log('raw result is ',result);
      const allPhantich = await pool.query('select p.id_key,p.author,p.title,p.shortdescription,p.source,p.revision,d.contentorder,d.content,d.minhhoa,d.minhhoatype from phantich as p join phantich_details as d on p.id_key = d.id_key order by p.id_key, d.contentorder');
      
      const results = {phantich: (allPhantich) ? allPhantich.rows : null};
      // console.log('manipulated result is ',results);
      response.render('pages/view_phantich', results );
    } catch (err) {
      console.error(err);
      response.send("Error " + err);
    }
  }else{
    try{
      const allPhantich = await pool.query('select p.id_key,p.author,p.title,p.shortdescription,p.source,p.revision,d.contentorder,d.content,d.minhhoa,d.minhhoatype from phantich as p join phantich_details as d on p.id_key = d.id_key WHERE p.id_key = $1 order by p.id_key, d.contentorder', [id]);
      
      const results = {phantich: (allPhantich) ? allPhantich.rows : null};
      // console.log('manipulated result is ',results);
      response.render('pages/view_phantich', results );
    }catch (err){
      console.error(err);
      response.send("Error " + err);
    }
  }
}

const getPhantich = async (request, response) => {
  const id = request.params.id
  if (id == undefined) {
    try {
      // const result = await pool.query('SELECT * FROM user_info ORDER BY idforvendor, adsid');
      // console.log('raw result is ',result);
      const allPhantich = await pool.query('select p.id_key,p.author,p.title,p.shortdescription,p.source,p.revision,d.contentorder,d.content,d.minhhoa,d.minhhoatype from phantich as p join phantich_details as d on p.id_key = d.id_key order by p.id_key, d.contentorder');
      
      const results = {phantich: (allPhantich) ? allPhantich.rows : null};
      // console.log('manipulated result is ',results);
      response.status(200).json(results.rows)
    } catch (err) {
      console.error(err);
      response.send("Error " + err);
    }
  }else{
    // do nothing at the moment

    // try{
    //   const allPhantich = await pool.query('select p.id_key,p.author,p.title,p.shortdescription,p.source,p.revision,d.contentorder,d.content,d.minhhoa,d.minhhoatype from phantich as p join phantich_details as d on p.id_key = d.id_key WHERE p.id_key = $1 order by p.id_key, d.contentorder', [id]);
      
    //   const results = {phantich: (allPhantich) ? allPhantich.rows : null};
    //   // console.log('manipulated result is ',results);
    //   response.render('pages/view_phantich', results );
    // }catch (err){
    //   console.error(err);
    //   response.send("Error " + err);
    // }
  }
}

const getAppConfig = (request, response) => {
  const id = parseInt(request.params.id)

  if (id != undefined) {
    pool.query('SELECT * FROM app_config', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }else{
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
}

//idforvendor | adsid | devicename | osname | osversion | appversion | appversionnumber | action | actiontype | actionvalue | collectiondate
const addAnalytics = (request, response) => {
  const { idforvendor, adsid, devicename, osname, osversion, appversion, appversionnumber, action, actiontype, actionvalue } = request.body
  console.log('body is ',request.body);
  console.log('idforvendor is ', idforvendor);
  console.log('adsid is ', adsid);
  console.log('devicename is ', devicename);
  console.log('osname is ', osname);
  console.log('osversion is ', osversion);
  console.log('appversion is ', appversion);
  console.log('appversionnumber is ', appversionnumber);
  console.log('action is ', action);
  console.log('actiontype is ', actiontype);
  console.log('actionvalue is ', actionvalue);

  timestamp = new Date()
  console.log('timestamp is ', timestamp);

  // response.json({requestBody: request.body})
  // status(201).send(`User added with ID: ${request.body}`)

  valid = true 

  if (idforvendor == undefined) {
    valid = false
  }
  if (adsid == undefined) {
    valid = false
  }
  if (devicename == undefined) {
    valid = false
  }
  if (osname == undefined) {
    valid = false
  }
  if (osversion == undefined) {
    valid = false
  }
  if (appversion == undefined) {
    valid = false
  }
  if (appversionnumber == undefined) {
    valid = false
  }
  if (action == undefined) {
    valid = false
  }
  if (actiontype == undefined) {
    valid = false
  }
  if (actionvalue == undefined) {
    valid = false
  }

  if (!valid) {
    response.status(200).send('{"status":"Fail"}')
  }else{
    pool.query('INSERT INTO user_info (idforvendor, adsid, devicename, osname, osversion, appversion, appversionnumber, action, actiontype, actionvalue, collectiondate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [idforvendor, adsid, devicename, osname, osversion, appversion, appversionnumber, action, actiontype, actionvalue, timestamp], (error, results) => {
      if (error) {
        throw error
      }
      if (results.rowCount == 1) {
        response.status(200).send('{"status":"Success"}')
      } else {
        response.status(200).send('{"status":"Fail"}')
      }
      // response.json({Result: results})
      // response.status(201).send(`User added with ID: ${results.insertId}`)
    })
  }
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
    )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  viewAnalytics,
  addAnalytics,
  getAppConfig,
  viewPhantich,
  getPhantich,
  updateUser,
  deleteUser,
}