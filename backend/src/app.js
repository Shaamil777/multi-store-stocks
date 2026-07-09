const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes")

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRoutes)


app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Multi store stocks API running"
    })
})

module.exports = app