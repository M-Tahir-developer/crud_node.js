const express = require('express');
const router = express.Router();
const User = require('../modules/users'); 
const multer = require('multer');
const fs = require('fs');
const {userpage,adduser,getedituser,deleteuser,updateuser} = require('../controller/users');


// Multer setup for file uploads
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Ensure the directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single('image');

// Add User Route
router.route("/add").post(upload,adduser)

// Home Route
router.route("/").get(userpage);

// Add User Page Route
router.get('/add', (req, res) => {
    res.render('add_user', { title: 'Add User' });
});


router.route('/edit/:id').get(getedituser);
// Update User Route
router.route('/update/:id').post(upload,updateuser);


router.route('/delete/:id').get(deleteuser);





module.exports = router;
