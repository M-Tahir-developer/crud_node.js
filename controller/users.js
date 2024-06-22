const User = require('../modules/users');

const userpage = async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
};

const adduser = async(req,res)=>{
    try {

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename, 
        });

        await newUser.save(); 

        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
}

const getedituser = async(req,res)=>{
    try{
        let id = req.params.id;
        const users = await User.findById(id)

        if(!users){
            res.redirect('/')
        }
        else{
            res.render('edit_users', {
                title: "Edit User",
                users: users,

            });
            console.log(users);
        } 
    }
    catch{
        res.redirect('/');
    }
}
const updateuser = async(req,res)=>{
    try {
        let id = req.params.id;
        let new_image = "";

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync(path.join(__dirname, '../uploads', req.body.old_image));
            } catch (error) {
                console.log(error);
            }
        } else {
            new_image = req.body.old_image;
        }

        let updatedUser = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image
        };

        await User.findByIdAndUpdate(id, updatedUser);

        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
}

const deleteuser = async(req,res)=>{
    try {
        let id = req.params.id;
        const user = await User.findOneAndDelete(id);

        if (!user) {
            res.redirect('/');
            return;
        }

        // If user has an image, delete it from uploads folder
        if (user.image) {
            try {
                await fs.unlink(path.join(__dirname, '../uploads', user.image));
            } catch (err) {
                console.error(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "User deleted successfully"
        };

        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message });
    }
}
module.exports = {userpage,adduser,getedituser,updateuser,deleteuser};