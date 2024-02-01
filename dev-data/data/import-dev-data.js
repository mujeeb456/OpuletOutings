const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'});
const Tour=require('./../../modules/TourModel');
const DB=process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
    );

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(()=>{
    console.log("dB connection..... ")
})

const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,"utf-8"));


const importData=async()=>{
    try{
        await Tour.create(tours);
        console.log("DAta successfuly loaded");
        process.exit();

    }catch (err){
        console.log(err)
    }
};
const deleteData=async ()=>{
    try{
        // await Tour.deleteMany({});
        console.log("DAta successfuly deleted");
        process.exit();
    }catch (err){
        console.log(err)
    }

}

if(process.argv[2]=='--import'){
    importData();
}else if(process.argv[2]=='--delete'){
    deleteData();
}

console.log(process.argv);