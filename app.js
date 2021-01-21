const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')    
const path = require('path')
const config = require('./utils/config')
const multer = require('multer')
const helpers = require('./utils/helpers')


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/public/uploads/');
    },

    filename: function(req, file, cb) {
	const _filename =  file.fieldname + '-' + Date.now() + '.png'
	console.log(_filename)
        cb(null, _filename);
	
    }
});

var upload = multer({
	storage : storage, 
	fileFilter: helpers.imageFilter,
})

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

app.get('/', (req,res) => {
	res.render('pages/home.ejs')
})

app.post('/', upload.single('userPhoto'), (req, res) => {
	console.log(req.file)
	res.redirect(`/imgs/${req.file.filename.slice(0,-4)}`)
});


app.use(middleware.errorHandler)

app.listen(config.PORT, ()=>console.log(`Server listening on port ${config.PORT}`))
