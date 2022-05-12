const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const {sign} = require('jsonwebtoken');
const validateToken = require("./middlewares/AuthMiddleWare");

const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


/*app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);*/

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "loginsystem",
  });

  app.post("/register" , (req,res)=>{

    const username = req.body.username; // getting variable from frontend
    const password = req.body.password;

    bcrypt.hash(password,saltRounds,(err,hash)=>{

      if (err) {
        console.log(err);
      }

      db.query("SELECT * FROM users WHERE username=? ;",username, (err,result)=>{
        if(err){
          //console.log(err);
          res.send({err: err});
        }
        else if((result.length>0))
        {
          res.send({message:"username already existed"});

        }
        else
        {
          db.query("INSERT INTO users (username, password) VALUES (?,?)", [username,hash],
      (err, result) => {
        if(err){
        console.log(err);}
        else{
          res.send("Successfully registered");
        }
      }
      );

        }
      })

      
     
    });

    
  });


  
  

  app.post("/login" , (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

 

   const user =  db.query("SELECT * FROM users WHERE username = ? ;", username,
    (err, result) => {
      if(err){
      //console.log(err);
      res.send({err: err});
    }
      
      
      
        if(result.length>0){
          //res.send(result);
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              // req.session.user = result; //creating a session
              //console.log(req.session.user);
              
              const accessToken = sign({username:user.username,id:user.id}, "subscribe");
              res.json(accessToken);
              //res.send(result);

            } else {
              res.send({ message: "Wrong username/password combination!" });
            }
          });
        }
        else{
          res.send({message : "User doesn't exist"});
        }

        //const accessToken = sign({username:user.username,id:user.id}, "subscribe");
       // res.send(accessToken);
      
    }
    );


  });

    
  app.get("/auth",validateToken,(req, res) => {
  res.json(req.user);
  });




  app.listen(3001, () => {
    console.log("running server");
  });