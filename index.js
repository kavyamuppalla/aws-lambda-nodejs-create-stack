exports.handler = (event, context, callback) => {
	var AWS = require('aws-sdk');
	AWS.config.update({ region: 'us-east-1' });

	var cloudformation = new AWS.CloudFormation({region: 'us-east-1'});
	var s3 = new AWS.S3({params: {Bucket: 'serverless-pipeline-artifacts'}, region: 'us-east-1'});
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
	  if (err) {
	  	console.log(err, err.stack); // an error occurred
		} else {
			console.log(data);           // successful response

			//Uploading Sample file to S3
			s3.putObject({
	  		Bucket: 'serverless-pipeline-artifacts',
	  		Key: 'test/sample-node.txt',
	  		Body: 'Invoke Test'
	  	}, function(err, data) {
	  		console.log("Error ==== " + err);
	  		console.log("Data ==== " + data);
	  	});
		}
	});
	
	callback(null, "SUCCESS");
};