var fs = require('fs')
	, helper = require('../lib/helper')
	, MongoClient = require('mongodb').MongoClient;

var history = {}


history.init = function (){
	this.getDataOverTime('repoHistory', 'issue')
	this.getDataOverTime('repoPullsHistory', 'pulls')
	this.getClosedDataOverTime('repoClosedPullsHistory', 'PR')
	this.getClosedDataOverTime('repoClosedIssueHistory', 'issue')
}

history.getDataOverTime = function(database, target) {
	this.resetHistory(database);
	fs.readFile('./repoData/repo_' + target + '_history.txt','UTF-8', function(err, data){
    if(err) throw err;
    	history.connect(database, function(db){
	      	repoChunk = data.split('*');
		    for(var i = 1; i < repoChunk.length; i++){
		    	repoDt = repoChunk[i].split(',');
				var date = repoDt[0];
				for(var j = 1; j < repoDt.length-1; j++){
					var arr = repoDt[j].trim().split('  ');
		   			var collection = arr[0].trim(); 
		   			var amount = arr[1];
		   			dates = date.split(' = ')
					var doc = target == 'pulls' ?
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'pulls': amount } :
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'issues': amount }

			   		db.collection(collection).insert(doc, function(err, inserted){
			   			if(err) throw err;
			   		});
				}
		    }
    	});
	});
	helper.log('HISTORY', 'new ' + target +' history added', false);
}

history.getClosedDataOverTime = function(database, target) {
	this.resetHistory(database);
	fs.readFile('./repoData/closed_' + target + '_history.txt','UTF-8', function(err, data){
    if(err) throw err;
    	history.connect(database, function(db){
	      	repoChunk = data.split('*');
		    for(var i = 1; i < repoChunk.length; i++){
		    	repoDt = repoChunk[i].split(',');
				var date = repoDt[0];
				for(var j = 1; j < repoDt.length-1; j++){
					var arr = repoDt[j].trim().split('  ');
		   			var collection = arr[0].trim(); 
		   			var amount = arr[1];
		   			dates = date.split(' = ')
					var doc = target == 'PR' ?
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'pulls': amount } :
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'issues': amount }

			   		db.collection(collection).insert(doc, function(err, inserted){
			   			if(err) throw err;
			   		});
				}
		    }
    	});
	});
	helper.log('HISTORY', 'new ' + target +' history added', false);
}

history.resetHistory = function(rep) {
	history.connect(rep, function(db){
		db.dropDatabase();
		db.close();
	});
	helper.log('HISTORY', 'prev ' + rep +' DB history removed', false);
}

history.connect = function(dbase, callback) {
	MongoClient.connect("mongodb://127.0.0.1:27017/" + dbase, function(err, db){
		if(err) throw err;
		callback(db);
	});
}
module.exports = history.init();
