const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')    
const path = require('path')
const config = require('./utils/config')

const app = express()

app.use(express.json())
app.use(cors())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))

const baseUrl = `http://localhost:${config.PORT}`

app.get('/imgs/:id', (req,res) => {
	const id = req.params.id
	res.render('pages/image.ejs', {image_path: `${baseUrl}/uploads/${id}.png`})
})

app.use(middleware.errorHandler)

module.exports = app
