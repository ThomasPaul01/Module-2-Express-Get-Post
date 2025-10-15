import dotenv from 'dotenv'
import pkg from 'pg'
import { fileURLToPath } from 'url'


// Temporarily mute console output while dotenv injects env to avoid its informational banner
{
	const original = { log: console.log, info: console.info, warn: console.warn }
	try {
		console.log = console.info = console.warn = () => {}
		dotenv.config()
	} finally {
		console.log = original.log
		console.info = original.info
		console.warn = original.warn
	}
}

const { Client } = pkg

const connectionConfig = {
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
}

export async function getConnection (username, password, database) {
	const cfg = {
		...connectionConfig,
		user: username || connectionConfig.user,
		password: password || connectionConfig.password,
		database: database || connectionConfig.database,
	}

 	const client = new Client(cfg)
	await client.connect()
	return client
}

export async function getAllUsers () {
	const client = new Client(connectionConfig)
	try {
		await client.connect()
		const res = await client.query('SELECT * FROM users')
		console.log('Query result rows:', res.rows)
		return res.rows
	} catch (err) {
		console.error('Error querying users:', err.message || err)
		throw err
	} finally {
		await client.end()
	}
}

export function getUsers (callback) {
 	getConnection()
 		.then(client => {
 			client.query('SELECT * FROM users')
 				.then(res => {
 					callback(null, res.rows)
 					client.end().catch(() => {})
 				})
 				.catch(err => {
 					callback(err)
 					client.end().catch(() => {})
 				})
 		})
 		.catch(err => {
 			callback(err)
 		})
}

export async function insert_user(user){
    const client = new Client(connectionConfig)
    try {
        await client.connect()
        const res = await client.query('INSERT INTO users(name, email) VALUES($1, $2) RETURNING *', [user.name, user.email])
        console.log('Inserted user:', res.rows[0])
        return res.rows[0]
    } catch (err) {
        console.error('Error inserting user:', err.message || err)
        throw err
    } finally {
        await client.end()
    }
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {

    getAllUsers()
		.then(() => process.exit(0))
		.catch(() => process.exit(1))

	getConnection('postgres', 'postgres', 'apprentissageExpress')
		.then(client => {
			console.log('getConnection: connected')
			return client.end()
		})
		.catch(err => {
			console.error('getConnection demo error:', err)
		})

	getUsers((err, rows) => {
		if (err) {
			console.error('Error fetching users:', err)
		} else {
			console.log('Fetched users:', rows)
		}
	})

    const user = {name: 'Alice', email: 'alice2@example.com'}
    insert_user(user)
    .then(
        (insertedUser) => {
            console.log('Inserted user:', insertedUser)
        } 
    ).catch((err) => {
        console.error('Error inserting user:', err)
    })
    
}

export default { getAllUsers, getConnection, getUsers, insert_user }


