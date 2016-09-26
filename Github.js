var Promise = require('promise');
var request = require('request');

Github = function() {

}

Github.prototype.get_all_issues = function(username, reponame) {
    var options = {
        method: 'GET',
        url: 'https://api.github.com/repos/' + username + '/' + reponame + '/issues',
        headers: {
            'User-Agent': username,
            'cache-control': 'no-cache'
        }
    };

    return new Promise(function(fulfill, reject) {
        request(options, function(error, response, body) {
            if (error) reject(error);
            else fulfill(JSON.parse(body));
        });
    });
}

module.exports = new Github();