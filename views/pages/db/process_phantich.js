const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

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
      // const allPhantich = await pool.query('select p.id_key,p.author,p.title,p.shortdescription,p.source,p.revision,d.contentorder,d.content,d.minhhoa,d.minhhoatype from phantich as p join phantich_details as d on p.id_key = d.id_key order by p.id_key, d.contentorder');
      
      // const results = {phantich: (allPhantich) ? allPhantich.rows : null};
      // // console.log('manipulated result is ',results);
      // response.status(200).json(results.rows)
      pool.query('select p.id_key,p.author,p.title,p.shortdescription,p.source,p.source_inapp,p.revision,d.contentorder,d.content,d.minhhoa,d.minhhoatype from phantich as p join phantich_details as d on p.id_key = d.id_key order by p.id_key, d.contentorder', (error, results) => {
      	if (error) {
      		throw error
      	}
      	response.status(200).json(results.rows)
      })
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

const addPhantich = async (request, response) => {
	const { queryString } = request.body
	console.log('body is ',request.body);
	console.log('queryString is ', queryString);

	timestamp = new Date()
	console.log('timestamp is ', timestamp);

	valid = true 

	if (queryString == undefined || queryString.length < 1) {
		valid = false
	}

	if (!valid) {
		response.render('pages/InsertPhantich');
	}else{
		console.log('-- Executing query: ', queryString);
		try{
			const execQuery = await pool.query(queryString,)
			console.log('-- Results: ', execQuery);
			if (execQuery.rowCount == 1) {
				response.render('pages/InsertPhantich', "Success!")
			} else {
				response.render('pages/InsertPhantich', "Failed!!!")
			}
		} catch (err){
			console.log('-- ERROR: ', err);
			response.render('pages/InsertPhantich', err)
		}
	}
}

module.exports = {
	viewPhantich,
	getPhantich,
	addPhantich
}