const express=require("express");
const app=express();
const port=process.env.PORT||3000;
const bodyParser=require("body-parser");
const https=require("https");
const dotenv =require("dotenv");
const { log } = require("console");
const path=require("path");
dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));



app.use(express.static("public"));

// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "./client/build/signup.html"),
//     function (err) {
//       res.status(500).send(err);
//     }
//   );
// });

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.post("/", function(req, res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;
    const data={
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }

            
            

        }]
    };

    const jsonData=JSON.stringify(data);
    const url=`https://us21.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;
    const options={
        method:"POST",
        auth:`aakash:${process.env.API_KEY}`
    }
    console.log(`aakash:${process.env.API_KEY}`);
    console.log(url);
    const request=https.request(url, options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
        
    });

    request.write(jsonData);
    request.end();



});

app.listen(port, function(){
    console.log(`App listening to ${port}`);
});


