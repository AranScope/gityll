////////////////////////////////////////////

var express = require('express')
var app = express();
var fs = require('fs');
var request = require("request");
var marked = require('marked');
var bodyParser = require('body-parser');
var Promise = require('promise');
app.use(bodyParser.json());

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

/////////////////////////////////////////////

var github_name = 'aranscope';
var repo_name = 'gityll';
var post_template_url = './templates/template.html';
var contents_template_url = './templates/contents-template.html';
var blog_name = 'gityll - github as a CMS';

/////////////////////////////////////////////

var contents = new Contents(blog_name);

/////////////////////////////////////////////

// construct a new post
function Post(title, body, author, author_url, author_icon_url, tags, colors, time) {
    this.title = title;
    this.body = body;
    this.author = author;
    this.author_url = author_url;
    this.author_icon_url = author_icon_url;
    this.tags = tags;
    this.colors = colors;
    this.time = time;
    this.html = marked(this.body);
}

// write a post to file, including html templating logic (should be separated)
Post.prototype.write_to_file = function() {

    var post = this

    fs.readFile(post_template_url, function(err, data) {
        if (err) throw err;
        data = String(data);
        data = data.replace('{{title}}', post.title);
        data = data.replace('{{body}}', post.html);
        data = data.replace('{{tags}}', buttons_from_tags(post.tags, post.colors));
        data = data.replace('{{author}}', '<br><br><a href=' + post.author_url + '>Written with <3 by ' + '@' + post.author);

        console.log('template \'' + post_template_url + '\' read.');

        fs.writeFile("./" + post.title + ".html", data, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('post \'' + post.title + '\' written.');
            }
        });
    });
}

/////////////////////////////////////////////

// construct a new contents page, a set of post names
// and urls with an associated title.
function Contents(title) {
    this.title = title;
    this.post_names = [];
    this.post_urls = [];
}

// add a new post to the contents page, if the post already
// exists, replace it.
Contents.prototype.add_post = function(post_name, post_url) {

    var index = this.post_names.indexOf(post_name);

    if (index > -1) {
        this.post_names[index] = post_name;
        this.post_url[index] = post_url;
    } else {
        this.post_names.push(post_name);
        this.post_urls.push(post_url);
    }
}

// write the contents page to a file
Contents.prototype.write_to_file = function() {

    var contents = this;

    fs.readFile(contents_template_url, function(err, data) {
        if (err) throw err;
        data = String(data);
        data = data.replace('{{title}}', contents.title);

        var button = '<a class="button" href="{{href}}" style="margin: 5px;">{{body}}</a>'
        var new_body = '<h1>' + contents.title + '</h1>';

        for (i in contents.post_names) {
            var post_name = contents.post_names[i];
            var post_url = contents.post_urls[i];

            var new_button = button.replace('{{body}}', post_name).replace('{{href}}', post_url);
            new_body += new_button;
        }

        data = data.replace('{{body}}', new_body);

        console.log('template \'' + contents_template_url + '\' read.');

        fs.writeFile("./contents.html", data, function(err) {
            if (err) throw err;

            console.log('contents written.');
        });
    });
}

/////////////////////////////////////////////

// generate a list of buttons from a list of tags and colors
function buttons_from_tags(tags, colors) {
    var row = '<div style="display: inline-block;">{{body}}</div>';
    var button = '<button class="button-small button-outline" style="margin: 5px;">{{body}}</button>';
    var columns = '';

    for (i in tags) {
        var tag = tags[i];
        var color = colors[i];
        columns += button.replace('{{body}}', tag);
    }

    var new_row = row.replace('{{body}}', columns);

    return new_row;
}


// Convert a github issue into a post
function parse_issue(issue) {
    var post_title = issue.title;
    var post_body = issue.body;

    var user_name = '';
    var user_url = '';
    var user_icon = '';

    if (issue.assignees.length > 0) {
        user_name = issue.assignees[0].login;
        user_url = issue.assignees[0].html_url;
        user_icon = issue.assignees[0].avatar_url;
    }

    var post_tags = [];
    var post_cols = [];

    var post_time = issue.updated_at;

    for (p in issue.labels) {
        post_tags.push(issue.labels[p].name);
        post_cols.push(issue.labels[p].color);
    }

    return new Post(post_title, post_body, user_name, user_url, user_icon, post_tags, post_cols, post_time);
}

// get all of the issues in a given github users repo
function get_all_issues(name, repo) {
    var options = {
        method: 'GET',
        url: 'https://api.github.com/repos/' + name + '/' + repo + '/issues',
        headers: {
            'User-Agent': name,
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

// return a promise to read a file
function readFile(filename, enc) {
    return new Promise(function(fulfill, reject) {
        fs.readFile(filename, enc, function(err, res) {
            if (err) reject(err);
            else fulfill(res);
        });
    });
}

// called on application start
function start() {

    get_all_issues(github_name, repo_name).done(function(issues) {

        for (i in issues) {
            var post = parse_issue(issues[i]);
            post.write_to_file();
            contents.add_post(post.title, './' + post.title + '.html');
        }

        contents.write_to_file();
    });
}

// request to view a blog post
app.get('/:postname', function(req, res) {

    var path = './' + req.params.postname;

    if (fs.existsSync(path)) {
        var f = fs.readFileSync(path);

        res.send(String(f));

    } else {
        res.send('404 how did you even get here?');
    }


});

// webhook call from github issues
app.post('/issue', function(req, res) {

    console.log(String(req.body.action));
    console.log(req.body.issue);

    res.send('issue logged');

    var post = parse_issue(req.body.issue);
    post.write_to_file();

    contents.add_post(post);
    contents.write_to_file();
});

app.listen(80);
start();
