/**
 * ec2_running_stats
 * 
 * Trigger: every 1 hour
 * IAM: Engineer_Readonly
 * 
 * @see		npm_installer.sh, package.sh, credential.json
 * @since	2016-05-19
 * @author	Tomohiro Hirayama
 * 
 */
console.log('Loading function');

// import
require('date-utils');
const aws = require('aws-sdk');
const https = require('https');
const url = require('url');
const slack_url = 'https://hooks.slack.com/<webhook>';
const slack_req_opts = url.parse(slack_url);
const slack_channel = '#channel_name';
const slack_username = 'LambdaEC2StatBot';
slack_req_opts.method = 'POST';
slack_req_opts.headers = {'Content-Type': 'application/json'};


aws.config.loadFromPath('credential.json');
aws.config.update({region: 'ap-northeast-1'});

exports.handler = function(event, context) {

	var ec2 = new aws.EC2();
	var stats = {};
	var instance_type = '';
	var instance_state = '';

	ec2.describeInstances({},function(error,resp){
		resp['Reservations'].forEach(function(index){
			instance_type = index.Instances[0].InstanceType;
			instance_state = index.Instances[0].State.Name;
			if (stats[instance_type] == undefined) {
				stats[instance_type] = {};
			}
			if (stats[instance_type][instance_state] == undefined) {
				stats[instance_type][instance_state] = 0;
			}
			if (stats['total'] == undefined) {
				stats['total'] = {};
			}
			if (stats['total'][instance_state] == undefined) {
				stats['total'][instance_state] = 0;
			}
			stats[instance_type][instance_state]++;
			stats['total'][instance_state]++;
		});
		//console.log(JSON.stringify(stats, null, "\n"));
		// make message
		var dt = new Date();
		var msg = "=====================\n" + dt.toFormat("YYYY-MM-DD HH24:MI:SS") + " UTC\n";
		var data;
		for( var type in stats) {
			if (type != 'total') {
				data = stats[type];
				msg += "[" + type + "]" + ":\n";
				for (var state in data) {
					msg += "\t" + state + ': ' + data[state] + "\n";
				}
			}
		}
		msg += "-----\n";
		msg += "total:\n";
		for (var state in stats['total']) {
			msg += "\t" + state + ': ' + stats['total'][state] + "\n";
		}
		msg += "=====================\n";

		console.log(msg);

		// send to slack
		var req = https.request(slack_req_opts, function (res) {
			if (res.statusCode === 200) {
				console.log('successed');
			} else {
				console.log('failed');
			}
		});
		req.write(JSON.stringify({channel: slack_channel, username:slack_username, text: msg}));
		req.end();
	});
};