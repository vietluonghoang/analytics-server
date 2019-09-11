const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


const getUsers = (request, response) => {
  pool.query('SELECT * FROM user_info ORDER BY idforvendor, adsid', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//idforvendor | adsid | devicename | osname | osversion | appversion | appversionnumber | action | actiontype | actionvalue | collectiondate
const createUser = (request, response) => {
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

  pool.query('INSERT INTO user_info (idforvendor, adsid, devicename, osname, osversion, appversion, appversionnumber, action, actiontype, actionvalue, collectiondate) VALUES ($1, $2)', [idforvendor, adsid, devicename, osname, osversion, appversion, appversionnumber, action, actiontype, actionvalue, timestamp], (error, results) => {
    if (error) {
      throw error
    }
    response.json({Result: results})
    // response.status(201).send(`User added with ID: ${results.insertId}`)
  })
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
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}