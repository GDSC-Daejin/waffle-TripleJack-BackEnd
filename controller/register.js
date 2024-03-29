const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async(req,res)=>{

    const checkUser = await User.findOne({studID : req.body.studID});

    //이미 존재하는 학번이라면 success:false
    if(checkUser) {
        console.log('존재하는 학번임');
        res.send({success : false})
        return;        
    }
    
    const user = new User();
    const {name,studID,password} = req.body;

    user.name = name;
    user.studID = studID;
    user.password = password;

    user.save((err)=>{
        if(err){
            return res.status(400).send(err);
        }
        else{
            return res.status(201).send({
                success : true
            })
        }
    })
})

module.exports = router;