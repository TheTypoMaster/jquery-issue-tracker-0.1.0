var mongoClient = require("mongodb").MongoClient
    , tmpLog = require('../lib/tmpLogger');

//connect to mongoDB and aquire data for all documents concerning repositories
exports.initConnection = function() {
 	console.log('schema connecting...');
    tmpLog.update('CONNECTION','mongoDB connection made', true );
	var projection = {"name": 1, "open_issues": 1,"_id": 0}
	repoNames = [];
	issueNo = [];
	connection("repositories", function(db){
		db.collection('repos').find({}, projection).each(function(err, doc){
	 		if(err) throw err;

			if(doc == null){
				db.close();
			}else{	
				repoNames.push(doc.name);
				issueNo.push(doc.open_issues);
			}
			exports.names = repoNames;
			exports.issues = issueNo;
			db.close();
		});  
	});
}


//connect to mongoDB and aquire data for a given repository
//set the view with relevant data
exports.getRecord = function(param, callback){
	var query = {"name": param};
	console.log('schema connecting...');
	tmpLog.update('CONNECTION','mongoDB connection made', true);
	connection("repositories", function(db){
		db.collection('repos').findOne(query, function(err, doc){
 			if(err) throw err;

  			tmpLog.update('QUERY TARGET' ,doc.name + ": outstanding issues: " + doc.open_issues, false);
  			db.close();

			callback(doc);
  		});  
    });
 }

exports.getIssueDates = function(req, res, param, callback) {
	var query = {"repo": param};
	teamName = query.repo;
	console.log('issue schema connecting...');
	var projection = { "created_at": 1, "title": 1,"_id": 0}
	tmpLog.update('CONNECTION','mongoDB connection made', true);
	connection("issues", function(db){
		db.collection(teamName).find({}, projection).toArray(function(err, doc){
			if(err) throw err;

			tmpLog.update('QUERY','mongoDB query made', false);
			db.close();

			callback(doc, teamName);
		});  
	});
}

exports.getHistory = function(param, callback) {
	var query = {"repo": param};
	collection = query.repo;
	var projection = {"date": 1, "issues": 1, "_id": 0};
	connection("repoHistory", function(db){
		db.collection(collection).find({}, projection).toArray(function(err, doc){
 		    if(err) throw err;

 		    tmpLog.update('REPO HISTORY', 'data resolved', false);
			db.close();

			callback(doc);
 	    });
	});
}

exports.getOpenPullRequestData = function(param, callback) {
	var query = {"repo": param};
	collection = query.repo;
	var projection = {"_id": 0};
	connection("pulls", function(db){
		db.collection(collection).find({}, projection).toArray(function(err, doc){
			if(err) throw err;

			db.close();
			callback(doc);
		});
	});
}
 
exports.getClosedPullRequestData = function(param, callback) {
	var query = {"repo": param};
	collection = query.repo;
	var projection = {"_id": 0};
	connection("pullsClosed", function(db){
		db.collection(collection).find({}, projection).toArray(function(err, doc){
			if(err) throw err;

			db.close();
			callback(doc);
		});
	});
}
 
exports.getClosedIssuesData = function(param, callback) {
	var query = {"repo": param};
	collection = query.repo;
	var projection = {"_id": 0};
	connection("issuesClosed", function(db){
		db.collection(collection).find({}, projection).toArray(function(err, doc){
			if(err) throw err;

			db.close();
			callback(doc);
		});
	});
}
 

var connection = function(dbase, callback) {
	mongoClient.connect("mongodb://127.0.0.1:27017/" + dbase, function(err, db){
		if(err) throw err;
		callback(db)
	});
}

 







