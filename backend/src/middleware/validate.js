const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        if(error.name === 'ZodError') {
            const issues = error.issues || error.errors || [];
            const messages = issues.map(err => err.message)
            return res.status(400).json({ success: false, errors: messages })
        }
        
        console.log(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

module.exports = validate