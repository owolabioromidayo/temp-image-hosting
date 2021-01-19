const errorHandler = (err,req,res,next) => {
	res.status(400).json({err : [err.name, err.message] })
	next(err)    
}

module.exports = {errorHandler}
