// imports
var fs = require('fs');
var marked = require('marked');
var Post = require('./Post.js');

// templates
var post_template = new Template('./templates/post.html');
var tag_template = new Template('./templates/tag.html');
var post_preview_template = new Template('./templates/post_preview.html')

// imports - setup
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

// precondition: the issue has at least 1 assignee.
Post = function(issue) {

    this.title = issue.title;
    this.markdown = issue.body;
    this.body = marked(this.markdown);

    // add the first assignee as the posts author.
    this.post_author_name = '';
    this.post_author_url = '';

    if (issue.assignees.length > 0) {
        this.post_author_name = issue.assignees[0].login;
        this.post_author_url = issue.assignees[0].html_url;
    }

    this.tags = []; // name, color

    var post = this;

    issue.labels.forEach(function(label) {
        post.tags.push(label);
    });

    time = issue.updated_at.split('-');
    this.date = time[2].substring(0, 2) + '.' + time[1] + '.' + time[0];

    this.url = this.title.replaceAll(' ', '').replaceAll('/', '');

}

// generate html for the tags of this post.
Post.prototype.html_tags = function(template) {
    var body = '';

    this.tags.forEach(function(tag) {
        body += template.apply({
            href: '/topic/' + tag.name,
            color: '#' + tag.color,
            body: tag.name
        });
    });

    return body;
}

Post.prototype.to_html = function() {

    var post_html = post_template.apply({
        title: this.title,
        date: this.date,
        body: this.body,
        post_author_url: this.post_author_url,
        post_author_name: this.post_author_name,
        tags: this.html_tags(tag_template),
    });

    return post_html;
}

Post.prototype.preview = function() {

    var post_preview_html = post_preview_template.apply({
        title: this.title,
        body: marked(this.markdown.substring(0, 160) + '...'),
        post_author_name: this.post_author_name,
        time: this.date,
        tags: this.html_tags(tag_template),
        href: this.url
    });

    return post_preview_html;

}

module.exports = Post;
