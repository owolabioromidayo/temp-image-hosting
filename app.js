const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')    
const path = require('path')
const config = require('./utils/config')
const multer = require('multer')
const helpers = require('./utils/helpers')
const cron = require('node-cron')
const {v4: uuidv4} = require('uuid')
const fs = require('fs')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/public/uploads/');
    },

    filename: function(req, file, cb) {
	const _filename =  uuidv4() + '.png'
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


cron.schedule('12 *', () => {
	const directory = __dirname + '/public/uploads' 
	fs.readdir(directory, (err,files) => {
		if (err) throw err

		for (const file of files){
			fs.unlink(path.join(directory, file), err => {
				if (err) throw err
			})	
		}
	})

	console.log('uploads directory cleared')
})


app.get('/imgs/:id', (req,res) => {
	const id = req.params.id
	res.render('pages/image.ejs', {image_path: `${baseUrl}/uploads/${id}.png`})
})

app.get('/', (req,res) => {
	res.render('pages/home.ejs')
})

app.post('/', upload.single('userPhoto'), (req, res) => {
	console.log(`${req.file.filename} has been added`)
	cron.schedule('* * * *', () => {
		fs.unlink(__dirname + '/public/uploads/' +req.file.filename, err => {
			if (err) throw err
		})
		console.log(req.file.filename +' deleted')
	})
	res.redirect(`/imgs/${req.file.filename.slice(0,-4)}`)
});


app.use(middleware.errorHandler)

app.listen(config.PORT, ()=>console.log(`Server listening on port ${config.PORT}`))
