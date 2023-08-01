var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
var multer = require('multer');
// Định nghĩa Schema cho Collection "Oto"
const CarSchema = new mongoose.Schema({
    ten: String,
    gia: String,
    nam: String,
    linkAnh: [String], // Mảng chứa các link ảnh
});
/* GET home page. */
router.get('/', async function(req, res, next) {
    const  Car = mongoose.model('Car', CarSchema, 'Car');
    const  data = await Car.find({});
    res.render('index', { title: 'Express' ,data:data});
});
//

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    },
});

var upload = multer({ storage: storage });
//
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://cachung9a4:cachung2002@lab56.ssbaqpw.mongodb.net/Lab5_6');
}
router.post('/upCar', upload.array('anh',3), async function (req,res,next){
    const  files = req.files
    const tempFilePaths = files.map(file => file.path);
    let CarM = mongoose.model('Car', CarSchema,'Car');
    await CarM.create({
        ten: req.body.ten,
        gia: req.body.gia,
        nam: req.body.nam,
        linkAnh: tempFilePaths, // Mảng chứa các link ảnh
    })
   res.redirect('/')
})
//
router.get('/delete/:id', async function (req,res, next){
 const params = req.params.id;
 console.log(params)
 let Car = mongoose.model('Car',CarSchema,'Car');
 await Car.deleteOne({_id:params})
    res.redirect('/')
})
 router.get('/update/:id', async function (req,res,next){
     const id = req.params.id;
     let CarM = mongoose.model('Car',CarSchema,'Car');
    try{
    const  Car = await CarM.findById(id).exec();
     console.log(Car)
        res.render('update',{data: Car})
    }
    catch (error){

    }

 })
router.post('/update/updateCar/:id', upload.array('anh',5),async function (req,res,next){
    const id = req.params.id;
    const  files = req.files
    const tempFilePaths = files.map(file => file.path);
    let CarM = mongoose.model('Car',CarSchema,'Car');
    const newCar = {
        ten : req.body.ten,
        gia: req.body.gia,
        nam: req.body.nam,
        linkAnh:tempFilePaths
    }
    await CarM.findByIdAndUpdate(id,newCar)
    res.redirect('/')
})
module.exports = router;
