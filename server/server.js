require('dotenv').config({path:'./config/.env'});

const express =require('express');
const cors =require('cors');
const connectDB=require('./config/db.js')

const projectRoutes = require('./routes/routes');
const authRoutes = require('./routes/routes');  

const app =express();

const PORT =process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json());

connectDB();

app.use('/projects', projectRoutes);  

app.use('/auth', authRoutes); 

app.listen(PORT, () => {

  console.log(`server is running at http://localhost:${PORT}`)
});