// data about the package
// the name has to match the package name and folder name used by the repo

const name = 'loqa'
const desc = 'the social media app for communities large and small'
const version = '0.0.1'
const deps = {}

// the function that actually runs

const exec = (MSPMStuff, cb) =>{

    // any libs

    const NZTK = require('../../../other/NZTK')
    const nztk = new NZTK(`${name} installer`, MSPMStuff.users.current)
    const fs = require('fs')
    const fsextra = require('fs-extra')
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

    // any configs for some reason

    const credencials = require('./backend/configs/loqa/credencials.json')

    // all of your code

    console.clear()
    process.stdout.write(`please input your mongoDB link > `)

    mutableStdout.muted = true
    rl.question('please input your mongoDB link > ', (a) =>{

        mutableStdout.muted = false
        if(a) nztk.log.success(`got the link`, 2, "")
        else return cb({name: name, exitCode: 1, value: "no mongoDB link, can't proceed"})

        credencials.mongoLink = a

        fs.writeFile(`./SHELL/temp/MSPM/${name}/backend/configs/loqa/credencials.json`, JSON.stringify(credencials), (e) =>{

            if(e) return cb({name: name, exitCode: 1, value: e})
            else nztk.log.success(`overwritten ./SHELL/temp/MSPM/${name}/backend/configs/loqa/credencials.json`, 2, '')

<<<<<<< HEAD
            fsextra.move(`./SHELL/temp/MSPM/${name}/backend/configs/.`, `./SHELL/configs/.`, {overwrite:true}, (e) =>{

                if(e) return cb({name: name, exitCode: 1, value: e})
                fsextra.move(`./SHELL/temp/MSPM/${name}/backend/programs/loqa.app.js`, `./SHELL/programs/app.loqa.js`, {overwrite:true}, (e) =>{

                    if(e) return cb({name: name, exitCode: 1, value: e})
                    fsextra.move(`./SHELL/temp/MSPM/${name}/backend/other/.`, `./SHELL/other/.`, {overwrite:true}, (e) =>{
=======
            fsextra.move(`./SHELL/temp/MSPM/${name}/backend/configs/.`, `./SHELL/configs/.`, (e) =>{

                if(e) return cb({name: name, exitCode: 1, value: e})
                fsextra.move(`./SHELL/temp/MSPM/${name}/backend/programs/loqa.app.js`, `./SHELL/programs/app.loqa.js`, (e) =>{

                    if(e) return cb({name: name, exitCode: 1, value: e})
                    fsextra.move(`./SHELL/temp/MSPM/${name}/backend/other/.`, `./SHELL/other/.`, (e) =>{
>>>>>>> 36a9878df98810ae2f65fe8eff98ee0ac0d6a98c

                        if(e) return cb({name: name, exitCode: 1, value: e})
                        nztk.log.success(`installing ${name} finished`, 2, '')
                        rl.close()
                        cb({name: name, exitCode: 0, value: 'installing finished, thank you for choosing loqa.'})
                    })
                }) 
            })
        })
    })
}

// export the installer

module.exports = {

    name: name,
    desc: desc,
    version: version,
    run: exec
}
