var helper = require('../lib/helper');
var MongoClient = require('mongodb').MongoClient;

var request = require('request');
var allRepos = require('../repoData/rep');	
var repoArray = allRepos.map(function(reps){ return reps.length; });
console.log(repoArray.length)   	

var connect = function(target, fn) {
	MongoClient.connect("mongodb://127.0.0.1:27017/" + target, function(err, db){
		if(err) throw err;

		fn(db);
	});
}

exports.repositoryMigrate = function() {
	helper.log('DATA MIGRATION', 'repositories loading...', false);
	connect('repositories', function(db){
		db.collection('repos').remove({});
		
	    db.collection('repos').insert(allRepos, function(err, data){
	    	if(err) throw err;
	    	helper.log('DATA MIGRATION', 'jquery repositories loaded', true);
			db.close();
	    });
	});
}
exports.openIssuesMigrate = function() {
	connect('issues', function(db){
		for(var i = 1; i < repoArray.length; i++){
			var obj = require('../repoData/issues/open/' + i + "_issues");
			if(obj == ""){
				continue
			}
	        var url = obj.map(function(data) { return data.url; })
		    var dataName = helper.getSplitValue(url, 5, '/');
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, function(err, data){
	            if(err) throw err;
	        });
		}
		helper.log('DATA MIGRATION', 'jquery open issues loaded', true);
});
}

exports.pullsMigrate = function() {
	connect('pulls', function(db){
		for(var i = 1; i < repoArray.length; i++){
			var obj = require('../repoData/pulls/open/' + i + "_pulls");
			if(obj == ""){
				continue
			}
        	var url = obj.map( function(data) { return data.url; })
		    var dataName = helper.getSplitValue(url, 5, '/');
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, function(err, data){
            if(err) throw err;

        	});
		}
		// db.close();
		helper.log('DATA MIGRATION', 'jquery open pulls loaded', true);
	// });
});
}


exports.eventsMigrate = function() {
    connect('events', function(db){
		for(var i = 1; i < repoArray.length; i++){
			var obj = require('../repoData/events/' + i + "events");
			if(obj == ""){
				continue
			}
        	var url = obj.map(function(data) { return data.url; })
		    var dataName = helper.getSplitValue(url, 5, '/');
		    dataName = helper.getSplitValue(dataName, 0, ',');
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, function(err, data){
            if(err) throw err;

        	});
		}
		// db.close();
		helper.log('DATA MIGRATION', 'jquery events loaded', true);
	});
}

exports.closedDataMigration = function(targetData){
	connect(targetData + 'Closed', function(db){
		for(var i = 1; i < repoArray.length; i++){
			obj = require('../repoData/' + targetData + '/closed/' + i + "_closed_" + targetData + "");
			if(obj == ""){
				continue
			}
        	var url = obj.map(function(data) { return data.url; })
		     var dataName = helper.getSplitValue(url, 5, '/');
		    db.collection(dataName).remove({});
		    var batch = db.collection(dataName).initializeUnorderedBulkOp({useLegacyOps: false}); //enable bulk inserting of data 
		    for(var j = 0; j < obj.length; j++){	
		    	batch.insert({  
		    		url: obj[j].url,
			    	id: obj[j].id, 
			    	title: obj[j].title,
			    	body: obj[j].body,
			    	created_at: obj[j].created_at,
			    	updated_at: obj[j].updated_at,
			    	closed_at: obj[j].closed_at,
			    	assignee: obj[j].assignee
			    });
		    }
		    batch.execute(function(err, result){});
		}
		db.close();
		helper.log('DATA MIGRATION', 'jquery closed ' + targetData + ' loaded', true);
	});
}

	
