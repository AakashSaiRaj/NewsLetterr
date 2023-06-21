const express=require("express");
const app=express();
const port=process.env.PORT;
const bodyParser=require("body-parser");
const https=require("https");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
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
    const url="https://us21.api.mailchimp.com/3.0/lists/561c655e64";
    const options={
        method:"POST",
        auth:"aakash:a4f452aa743e920c836c54d661ac82f7-us21"
    }
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


// a4f452aa743e920c836c54d661ac82f7-us21

// 561c655e64