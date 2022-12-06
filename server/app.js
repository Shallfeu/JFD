const express = require('express')
const mongoose = require('mongoose').default
const config = require('config')
const chalk = require('chalk')
const initDatabase = require('./startUp/initDatabase')
const routes = require('./routes')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api', routes)

const PORT = config.get('port') ?? 8080

// if(process.env.NODE_ENV === 'production'){
//     console.log('production')
// }else{
//     console.log('development')
// }

if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client')))
    const indexPath = path.join(__dirname, 'client', 'index.html')
    app.get('*', (req, res) => {
        res.sendFile(indexPath)
    })
}

async function start(){
    try {
        mongoose.connection.once('open', () => {
            initDatabase()
        })
        await mongoose.connect(config.get('mongoUri'))
        app.listen(PORT, () => console.log(chalk.green(`Server has been started on port ${PORT}`)))
    }catch (e){
        console.log(chalk.red(e.message))
        process.exit(1)
    }
}

start()
