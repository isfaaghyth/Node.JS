var http = require('http');
var url = require('url');
var qString = require('querystring');
var router = require('routes')();
var view = require('swig');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : "127.0.0.1",
	port : 3306,
	database : "nodejs",
	user : "root",
	password : ""
});

router.addRoute('/', function(req, res) {
	connection.query("select * from mahasiswa", function(err, rows, field) {
		if (err) throw err;

		var html = view.compileFile('index.html')({
			title : "Data Mahasiswa",	
			data : rows
		});

		res.writeHead(200, {"Content-Type" : "text/html"});
		res.end(html);
	});
});

router.addRoute('/insert', function(req, res) {
	if (req.method.toUpperCase() == "POST") {
		var data_post = "";
		req.on('data', function(chuncks) {
			data_post += chuncks;
		});
		req.on('end', function() {
			data_post = qString.parse(data_post);
			connection.query("insert into mahasiswa set ?", data_post, function(err, field) {
				if (err) throw err;
				res.writeHead(302, {"Location" : "/"});
				res.end();
			})
		})
	}
	else {
		var html = view.compileFile('form.html')();
		res.writeHead(200, {"Content-Type" : "text/html"});
		res.end(html);
	}
})

router.addRoute('/update', function(req, res) {
	connection.query("update mahasiswa set ? where ?", [
		{ nama :  "Kamu"},
		{ no_induk : 0110215039 }
	], function(err, field) {
		if (err) throw err;
		res.writeHead(200, {"Content-Type" : "text/plain"});
		res.end(field.changedRows+" Updated Rows");
	})
})

router.addRoute('/delete', function(req, res) {
	connection.query("delete from mahasiswa where ?", {
		no_induk : "0110215039"
	}, function (err, field) {
		if (err) throw err;
		res.writeHead(200, {"Content-Type" : "text/plain"});
		res.end(field.affectedRows+" Deleted Rows");
	})
})

http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname;
	var match = router.match(path);

	if (match) {
		match.fn(req, res);
	}
	else {
		res.writeHead(404, {"Content-Type" : "text/plain"});
		res.end("Page Not Found");
	}
}).listen(8888);

console.log("Server is Running ...");