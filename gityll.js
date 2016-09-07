var request = require("request");
var marked = require('marked');

var github_name = 'aranscope';
var repo_name = 'test-repo';
var post_template_url = './templates/template.html';
var contents_template_url = './templates/contents-template.html';
var blog_name = 'aran long - hacker, maker, comp sci';

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

var fs = require('fs');

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

Post.prototype.write_to_file = function(post) {
	fs.readFile(post_template_url, function(err, data) {
		if (err) throw err;
		data = String(data);
		data = data.replace('{{title}}', post.title);
		data = data.replace('{{body}}', post.html);
		data = data.replace('{{tags}}', buttons_from_tags(post.tags, post.colors));
		data = data.replace('{{author}}', '<br><br><a href=' + post.author_url + '>Written with <3 by ' + '@' + post.author);

		console.log('template \'' + post_template_url + '\' read.');

		fs.writeFile("./" + post.title + ".html", data, function(err) {
		    if(err) throw err;

		    console.log('post \'' + post.title + '\' written.');
		}); 
	});
}

function Contents(title) {
	this.title = title;
	this.post_names = [];
	this.post_urls = [];
}

Contents.prototype.add_post = function(post_name, post_url) {
	this.post_names.push(post_name);
	this.post_urls.push(post_url);
}

Contents.prototype.write_to_file = function(contents) {
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
		    if(err) throw err;

		    console.log('contents written.');
		}); 
	});
}

function buttons_from_tags(tags, colors) {
	var row = '<div style="display: inline-block;">{{body}}</div>'
	var button = '<button class="button-small button-outline" style="margin: 5px;">{{body}}</button>';
	var columns = '';

	for(i in tags) {
		var tag = tags[i];
		var color = colors[i];
		columns += button.replace('{{body}}', tag);
	}

	var new_row = row.replace('{{body}}', columns);

	return new_row;
}

var options = { method: 'GET',
  url: 'https://api.github.com/repos/' + github_name + '/' + repo_name + '/issues',
  headers: 
   { 'User-Agent': github_name,
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var issues = JSON.parse(body);
  var contents = new Contents(blog_name);

  for (i in issues){
  	var post_title = issues[i].title;
  	var post_body = issues[i].body;

  	var user_name = issues[i].assignees[0].login;
  	var user_url = issues[i].assignees[0].html_url;
  	var user_icon = issues[i].assignees[0].avatar_url;

  	var post_tags = []
  	var post_cols = []
  	
  	var post_time = issues[i].updated_at;

  	for (p in issues[i].labels) {
  		post_tags.push(issues[i].labels[p].name);
  		post_cols.push(issues[i].labels[p].color);
  	}

  	var post = new Post(post_title, post_body, user_name, user_url, user_icon, post_tags, post_cols, post_time);
  	post.write_to_file(post);
  	contents.add_post(post.title, './' + post.title + '.html');
  }

  contents.write_to_file(contents);
});
