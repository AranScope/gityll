var fs = require('fs');
var express = require('express');
var app = express();
var github = require('./Github.js');
var Template = require('./Template.js');
var Post = require('./Post.js');
var Contents = require('./Contents.js');
var bodyParser = require('body-parser');

var contents_template = new Template('./templates/contents.html');
var topics_template = new Template('./templates/filter.html');

var content_dir = './content/';
var static_dir = './static/';

var contents = new Contents();

app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.redirect('/contents');
});

app.get('/:post', function(req, res) {
    var path = './' + content_dir + req.params.post + '.html';

    if (fs.existsSync(path)) {
        var f = fs.readFileSync(path);
        res.send(String(f));
    } else {
        res.send('404 how did you even get here?');
    }

});

app.get('/topic/:topicname', function(req, res) {
    var post_previews = '';

    for (i in contents.posts) {
        for (j in contents.posts[i].tags) {
            if (contents.posts[i].tags[j].name == req.params.topicname) {
                var post = contents.posts[i];
                post.url = '../' + post.url;
                post_previews += post.preview();
            }
        }
    }

    var response = topics_template.apply({
        posts: post_previews,
        title: req.params.topicname
    });

    res.send(response);
});

// webhook call from github issues
app.post('/issue', function(req, res) {

    console.log(String(req.body.action));
    console.log(req.body.issue);

    res.send('issue logged');

    var post = new Post(req.body.issue);

    contents.add_post(post);

    fs.writeFile(content_dir + post.url + '.html', post.to_html(), function(err) {
        if (err) throw err;
        console.log('post: ' + post.title + ' written');
    });
});

String.prototype.equalsIgnoreCase = function(cmp) {
    return this.toUpperCase() == cmp.toUpperCase();
}

function start() {
    github.get_all_issues(github_name, repo_name).done(function(issues) {

        issues.forEach(function(issue) {
            if (issue.assignees.length > 0 && issue.assignees[0].login.equalsIgnoreCase(github_name)) {

                var post = new Post(issue);
                contents.add_post(post);

                fs.writeFile(content_dir + post.url + '.html', post.to_html(), function(err) {
                    if (err) throw err;
                    console.log('post: ' + post.title + ' written');
                });
            }
        });

        fs.writeFile(content_dir + 'contents.html', contents.to_html(), function(err) {
            if (err) throw err;
        });
    });
}

var args = process.argv.slice(2)
if (args.length != 2) {
    console.log('usage: node gityll.js port repo-url')
    process.exit()
}

var port = args[0]
var url_split = args[1].split('/')
github_name = url_split[url_split.length - 2]
repo_name = url_split[url_split.length - 1]
console.log(github_name + ", " + repo_name)

start(github_name, repo_name);

app.listen(port);
