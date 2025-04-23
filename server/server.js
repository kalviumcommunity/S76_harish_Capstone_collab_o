require('dotenv').config({path:'./config/.env'});

const express =require('express');
const cors =require('cors');
const connectDB=require('./config/db.js')

const projectRoutes = require('./routes/routes');

const app =express();

const PORT =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/projects', projectRoutes);  

app.listen(PORT, () => {

  console.log(`server is running at http://localhost:${PORT}`)
});