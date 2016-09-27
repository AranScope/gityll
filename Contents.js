// imports
var fs = require('fs');
var Post = require('./Post.js');
var Template = require('./Template.js');
var marked = require('marked');

// templates
var tag_template = new Template('./templates/tag.html');
var contents_template = new Template('./templates/contents.html');

function Contents() {
    this.posts = [];
}

Contents.prototype.add_post = function(post) {
    var replaced = false;

    for(i in this.posts) {
        if(this.posts[i].title == post.title) {
            this.posts[i] = post;
            replaced = true;
            break;
        }
    }

    if(!replaced) {
        this.posts.push(post);
    }
}

Contents.prototype.html_previews = function() {
    var html = '';

    this.posts.forEach(function(post) {
        html += post.preview();
    });

    return html;
}

Contents.prototype.to_html = function() {
	var html = contents_template.apply({
		title: this.posts[0].post_author_name,
		posts: this.html_previews()
	});

	return html;
}

module.exports = Contents;
