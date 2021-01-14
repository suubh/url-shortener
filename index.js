const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port=3000;
var admin = require("firebase-admin");
var serviceAccount = require("./urlshort-e38df-firebase-adminsdk-3taiy-19c6a83908.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const static = express.static("public");
const urlsdb = admin.firestore().collection("urlsdb"); //It will connect with our databse created in firestore(firebase )
const usersdb = admin.firestore().collection("usersdb");


//Creating  a middleware using "use"
//"next()" will directly read the next code to display 
//if I will use "res.send()" then as a middleware it will show only the message inside send()

// app.use((req,res,next)=>{
//     console.log("Intercept confirm ")
//     next();
// });
app.use(static);
//using body-parser to get the data in json format 
app.use(bodyParser.json());








//now we are getting the data i.e from frontend to the server side after this we have to store the data 
app.post('/admin/urls/',(req,res)=>{
    //console.log(req.body);
    // res.send("Hello World from another")
    const {email,password,short,url}=req.body;
    usersdb.doc(email).get().then(response =>{

        const user = response.data();

        if(user && (user.email == email) && (user.password == password)){
           const doc =  urlsdb.doc(short);
           doc.set({url});
           res.send("Done");
        }
        else{
            res.send(403,"Go away !");
        }
    })
});

// app.post('/admin/sign/',(req,res) =>{
//     const {emailid,pwd}=req.body;
//     //const user =response.data();

//     const doc=usersdb.doc();
//     doc.set({emailid});
//     doc.set({pwd});
//     res.send("Done");
// })







app.get("/:short",(req,res) =>{
    console.log(req.params);
    const short=req.params.short;

    const doc= urlsdb.doc(short);
    doc.get().then(response =>{
       const data= response.data();
       if(data && data.url){
           res.redirect(301,data.url);
       }
       else{
           res.redirect(301,"https://github.com/suubh")
       }
    })
    //res.send("We will redirect you to "+short);
});




























app.listen(port, ()=> {
    console.log(`URL app listening at http://localhost:${port}`)
});