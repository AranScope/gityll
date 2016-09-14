// node gityll.js [port] [github user] [repo name]


var Template = require('./Template.js');
var Post = require('./Post.js');


var post_template = new Template('./templates/post.html');
var post_preview_template = new Template('./templates/post_preview.html')
var contents_template = new Template('./templates/post.html');

var issue = {
	title: 'test post title',
	body: 'test post body',
	assignees: [{name: 'test name', url: 'test url', icon_url: 'icon url'}],
	labels: [{name: 'test issue', color: 'test color'}],
	updated_at: '2016-09-12T20:00:40Z'
};

var post = new Post(issue);

console.log(post.author);

var post = post_template.apply(
	{
		title: post.title,
		date: post.time,
		body: post.html,
		post_author_url: post.author.url,
		post_author_name: post.author.name,
		tags: String(post.tags)
	});

console.log(post);