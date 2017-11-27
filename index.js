exports.handler = (event, context, callback) => {
	var child_process = require('child_process');
	var AWS = require('aws-sdk');
	var fs = require('fs');
	var clone = require('nodegit-clone');
	AWS.config.update({ region: 'us-east-1' });

	child_process.exec('cd /tmp/ & rm -Rf sample-node/', function(error, stdout, stderr) {
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
		clone({url: 'https://github.com/kavyamuppalla/sample-node', localPath: '/tmp/sample-node'}).then(function(repo) {
			console.log("Path ==== " + repo.path());
			fs.readFile('/tmp/sample-node/infrastructure/resource.json', function(err, data) {
				console.log("Data 00000 " + data);
				var cloudformation = new AWS.CloudFormation({region: 'us-east-1'});
				var params = {
				  StackName: 'sample-node-stack',
				  DisableRollback: false,
				  ResourceTypes: [
				    'AWS::*'
				  ],
				  Tags: [
				    {
				      Key: 'Name', /* required */
				      Value: 'sample-node' /* required */
				    }
				  ],
				  TemplateURL: 'https://s3.amazonaws.com/serverless-pipeline-artifacts/templates/sample-node/resource.json',
				  TimeoutInMinutes: 5
				};
				cloudformation.createStack(params, function(err, data) {
				  if (err) console.log(err, err.stack); // an error occurred
				  else     console.log(data);           // successful response
				});
			});
		});
	});
	callback(null, "SUCCESS");
};