const mongoose =require('mongoose');

require('dotenv').config({path:'./config/.env'});

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log('database connected successfully')
    }
        catch(err){
            console.log('error',err)
            process.exit(1)
        }

}

module.exports =connectDB;