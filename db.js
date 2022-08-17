const homedir = require('os').homedir();//根目录
const home = process.env.HOME || homedir
const p = require('path')
const dbPath = p.join(home, '.todo')
const fs = require("fs");


const db = {
    read(path = dbPath) {
        return new Promise((resolve,reject)=>{
            fs.readFile(path, {flag: 'a+'}, (err, data) => {
                if (err) return reject(err)
                let list;
                try {
                    list = JSON.parse(data.toString())
                } catch (err2) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write(list,path = dbPath) {
        return new Promise((resolve,reject)=>{
            const str = JSON.stringify(list)
            fs.writeFile(dbPath,str,(err)=> {
                if (err) return reject(err)
                resolve()
            }
            )
        })

    }

}
module.exports= db