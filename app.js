const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongo = require('mongodb');
const fs = require('fs');
const nodemailer = require('nodemailer');


const app = express();

const port = 6789;
var MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const { table } = require('console');
var url = "mongodb://localhost:27017/";
var cosID = [];
var cosObj = [];

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'nodemailer.adrian@gmail.com',
	  pass: 'nodemailer123'
	}
  });

var mailOptions = {
	from: 'nodemailer.adrian@gmail.com',
	to: 'adrian.mircea9024@gmail.com',
	subject: 'Comanda noua!',
	text: ''
};

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(session({
	secret: "alabalaportocala",
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
}));

app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	next();
});

app.get('/', (req, res) => {
	user = req.cookies;
	res.render('index',{user: userConnected});
}
);

app.get('/despre', (req, res) =>{
	res.render('despre',{user: userConnected});
});

app.get('/contact', (req, res) => {
	res.render('contact', {user: userConnected});
});

app.get('/vizualizare_cos', (req, res) =>{

	cosObj = [];
	for(var i = 0; i< cosID.length; i++)
	{
		let contor = 0;
		tabel.forEach( obj=>{
			if( cosID[i] == contor)
				cosObj.push(obj)
			contor++;
		});
		
	}
	console.log(cosObj);

	if(cosObj.length == 0)
		res.redirect('/produse')
	else
		res.render('vizualizare_cos', {
			objects: cosObj, user: userConnected 
		});

});

app.post('/adaugare_cos', (req, res) => {
	cosID.push(req.body.id);
});

app.post('/', (req, res) => {
	user = req.cookies;
	res.render('index',{user: userConnected});
});

app.get('/autentificare', (req, res) => {
	res.render('autentificare')
	user = req.cookies;

}
);

app.post('/adauga-produs', (req,res) =>{
	data = req.body;
	console.log(data);

	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var database = db.db("cumparaturi");
		database.collection("produse").insertOne(data, function (err, res) {
			if (err) throw err;
				console.log("1 document inserted");
		});
		db.close();
	});
	res.redirect("/");
})
var userConnected;
app.get('/admin', (req, res) => {
	if ( userConnected.grad == "admin")
	{
		res.render('admin',{user: userConnected});
	}
	else
	{
		res.redirect('/');
	}
});

app.get('/produse', (req, res) =>{

	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var database = db.db("cumparaturi");
		tabel = database.collection("produse").find({}, {
			projection: {
				address: 0
			}
		}).toArray(function (err, result) {
			if (err) throw err;
			tabel = result;
			db.close();
		});
	});
	

	if (typeof tabel !== 'undefined') {

		res.render('produse', {
			objects: tabel, user: userConnected
		});
	}
	else
	{
		
		res.render('produse', {user: userConnected});
	}

});

app.post('/verifica-autentificare', (req,res) =>{

	user = req.body;
	var login = false;
    
	let data = fs.readFileSync('utilizatori.json');
    let listOfUsers = JSON.parse(data);
	console.log(user);
    
    listOfUsers.forEach(auth => {
        if (auth.utilizator == user.utilizator && auth.parola == user.pass) {
            login = true;
            userConnected = auth;
			console.log(userConnected);
        }
    })

	if(login == true)
	{
			res.cookie("utilizator", userConnected.nume_complet);
			res.redirect('/');
	}
	else
	{
		res.cookie("mesajEroare", "Date incorecte");
		res.redirect('/autentificare');
	}
});
app.get("/logout", (req, res) => {
	user = undefined;
	userConnected = undefined;
	cosObj = []
	cosID = []
	res.cookie("utilizator");
	res.redirect("/");
});

app.get('/creare-bd', (req,res) =>{
	MongoClient.connect(url, function (err, db){
		if(err) 
			throw err;
			var database = db.db("cumparaturi");
			console.log("Database created!")
		
			database.createCollection("produse", function(err, res) {
				if (err) 
					console.log("Database already created!");
				else
					console.log("Tabel created")
				db.close();
			});
	});
	res.redirect("/");
});

app.get('/incarcare-bd', (req,res) =>{
	if ( userConnected.grad == "admin"){
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var database = db.db("cumparaturi");
		var obj1 =[
			{
				produs: "Porumb boabe",
				pret: "0.99 lei/kg",
				cantitate: "1000 kg/bigbag",
				livrare:"2-3 zile"
			}, 
			{
				produs: "Grau pentru samanta",
				pret: "3.59 lei/kg",
				cantitate: "50 kg/sac",
				livrare: "1-2 zile"
			},
			{
				produs: "Floarea Soarelui",
				pret: "1.80 lei/kg",
				cantitate: "1000 kg/bigbag",
				livrare: "1-2 zile"
			},
			{
				produs: "Amestec animale",
				pret: "1.20 lei/kg",
				cantitate: "50 kg/sac",
				livrare: "1-2 zile"
			},
			{
				produs: "Rapita",
				pret: "2.10 lei/kg",
				cantitate: "1000 kg/bigbag",
				livrare: "2-3 zile"
			},
			{
				produs: "Cartofi pentru samanta",
				pret: "6.99 lei/kg",
				cantitate: "600 kg/bigbag",
				livrare: "1-2 zile"
			},
			{
				produs: "Cartofi pentru consum",
				pret: "1.20 lei/kg",
				cantitate: "20 kg/sac",
				livrare: "1-2 zile"
			},
			{
				produs: "Cartofi pentru industrializare",
				pret: "0.60 lei/kg",
				cantitate: "600 kg/bigbag",
				livrare: "2-3 zile"
			},
			{
				produs: "Sfecla de zahar",
				pret: " 450 lei/tona",
				cantitate: "1000 kg/bigbag",
				livrare: "5-7 zile"
			},
			{
				produs: "Soia",
				pret: "2.50 lei/kg",
				cantitate: "600 kg/bigbag",
				livrare: "5-7 zile"
			},
			{
				produs: "Grau panificatie",
				pret: "1.89 lei/kg",
				cantitate: "50 kg/sac",
				livrare: "1-2 zile"
			},
			{
				produs: "Morcov",
				pret: "3.29 lei/kg",
				cantitate: "5 kg/sac",
				livrare: "1-2 zile"
			},
			{
				produs: "Ceapa galbena",
				pret: "4.00 lei/kg",
				cantitate: "5 kg/sac",
				livrare: "1-2 zile"
			}
		];
		database.collection("produse").remove({});
		obj1.forEach( obj =>{
			database.collection("produse").insertOne(obj, function (err, res) {
				if (err) throw err;
					console.log("1 document inserted");
			});
		});
		db.close();
	});
	res.redirect("/");
	}
	else
	{
		res.redirect('/');
	}
});

app.get('/trimite-comanda', (req, res) =>{

	if(cosObj.length){
		
	mailOptions.text += "Comanda noua de la " + userConnected.utilizator + " \t( " + userConnected.nume_complet + " )\nProduse:\n"
	cosObj.forEach( obj =>{
		mailOptions.text += "\t" + obj.produs + "\t" + obj.cantitate + "\t" + obj.pret +"\n"
	});


	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });
	  
	}
	res.redirect('/produse');
});
app.get('/goleste-cos', (req, res) =>{
	cosObj = []
	cosID = []
	res.redirect('/produse');
});

app.get('/noutati', (req, res) => {
	res.render('noutati',{
		user: userConnected
	})
});
app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:6789`));