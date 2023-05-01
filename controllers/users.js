const mysql =require("mysql");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});
exports.login=async(req,res)=>{
    try{
        const{ name, password}=req.body;
        if(!name || !password){
            return res.status(400).render("login",{
                msg:"Please enter your Email and Password"

            });
        }
        db.query('select * from users where name=?',[name],async(error,result)=>{
            console.log(result);
            if(!result ||length<=0){
                return res.status(401).render("login",{
                    msg:" Email or Password incorrect.."
                });
            }else{
                if(!(await bcrypt.compare(password,result[0].PASS))){
                    return res.status(401).render("login",{
                        msg:" Email or Password incorrect.."
                    });
    
                }else{
                    const id=result[0].ID;
                    const token=jwt.sign({id: id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
                    console.log("the token is" + token);
                    const cookieOptions={
                        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000,),
                        httpOnly:true,
                    };
                    res.cookie("joes",token,cookieOptions);
                    res.status(200).redirect("/home");
                    
                  }
                }
             }
        );

    }
    catch(error){
        console.log(error);
    }

};
exports.register=(req,res)=>{
    console.log(req.body);
    const{ name, password, gender, email, dob,confirmpassword}=req.body;
    console.log(confirmpassword);
    db.query('select email from users where email=?',
    [email],
    async (error,result)=>{
       if(error){
        confirm.log(error);
       }

       if(result.length>0){
        return res.render('register',{msg:'Email already taken',})
       }else if(password!==confirmpassword){
        return res.render("register",{msg:"Password does not match",});
       }
       let hashedPassword =await bcrypt.hash(password,8);
       //console.log(hashedPassword);
       db.query(
        "insert into users set?",
        {name:name,email:email,pass:hashedPassword},
       (error,result) =>{
        if(error){
            console.log(error);
        }else{
            console.log(result);
            return res.render("register",{ msg: "User Registration Success"});
        }
       }
    );
   }
 );
};