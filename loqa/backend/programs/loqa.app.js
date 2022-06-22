// you need to make the filename have .app.js for the app to be usable from the CMDLINE
// i understand that's a lot of boilerplate but eh

// info about the app, required for it to run

const name = "loqa"
const desc = "the backend for loqa"
const version = "0.0.1"
const usage = "loqa"

// the function that gets executed

const exec = (NZSHHStuff, cb) =>{

    // any libs you might need

    const NZTK = require('../other/NZTK')
    const nztk = new NZTK(name, NZSHHStuff.users.current)
    const express = require('express')
    const app = express()
    const helmet = require('helmet')
    const mongus = require('mongoose')
    const morgan = require('morgan')

    // routes

    const authRoute = require('../other/loqa/routes/authRoute')
    const communitiesRoute = require('../other/loqa/routes/communitiesRoute')

    // const socket = require('./socket/main')

    // any configs you might need

    const globalConf = require('../configs/globalConf.json')
    const loqaConf = require('../configs/loqa/mainConf.json')
    const credentials = require('../configs/loqa/credencials.json')

    // the entirety of your code

    NZSHHStuff.appStuff.readline.close()
    var Writable = require('stream').Writable;
    var mutableStdout = new Writable({

        muted: false,
        write: (chunk, encoding, callback) =>{

            if(!this.muted){

                process.stdout.write(chunk, encoding);
            }
            callback();
        }
    });
    var rl = require('readline').createInterface({

        input: process.stdin,
        output: mutableStdout,
        terminal: true
    })

    mongus.connect(credentials.mongoLink, () =>{

        nztk.log.success('connected with mongoDB', 2, 's')
    });

    // middleware

    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', loqaConf.serverURL);
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    
        // Pass to next layer of middleware
        next();
    });

    app.use(express.json())
    app.use(helmet())
    app.use(morgan('common'))

    // routes

    app.use('/api/auth', authRoute)
    app.use('/api/communities', communitiesRoute)
        
    // server

    const server = app.listen(loqaConf.port, () =>{

        nztk.log.success('backend ready', 2, 'server')
    })

    // close the app

    rl.on("close", () =>{

        nztk.log.normal(`attempting to close off all remaining connections`, 2, '')
        server.close(() =>{

            nztk.log.success(`closed off all remaining connections`, 2)
            return cb({name: name, exitCode: 0, value: ""})
        })

        setTimeout(() =>{

            cb({name: name, exitCode: 1, value: "couldn't close remaining connections in time"})
        }, 10000)
    })
}

// export the app

module.exports = {name: name, desc: desc, version: version, usage: usage, run: exec}