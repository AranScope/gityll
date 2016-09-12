# gityll
[gityll.club](http://gityll.club) Because good things come in gityll packages.

Transform your issues into a blog. Using github issues as a CMS and Express as a web server.

## Examples
Checkout the in-progress version of Gityll on <a href="http://aranlong.co.uk/contents">my personal site.</a> This is all generated from the issues page <a href="http://github.com/aranscope/aranlong.co.uk">here.</a>

### Gityll issues
<a href="http://gityll.club">Link</a>

[Gityll](https://github.com/aranscope/gityll) is a customisable site generator using Github issues as a CMS and [Express](https://expressjs.com/) as a backend.

## Setup Guide
To run Gityll I suggest using a VPS from [DigitalOcean](https://digitalocean.com) or [AWS EC2](https://aws.amazon.com).

1. `git clone https://github.com/aranscope/gityll`
2. `cd gityll/templates/`
3. customise the contents template and post template to your hearts desire
4. `cd ..`
5. `node gityll.js [port] [git repo url]`

Running Gityll will throw dependency errors, in the meantime before this is properly packages, you can manually run ```npm install [dependency]``` or ```npm install [dependency] -g``` to install these dependencies locally or globally. 

## Tags
### Posts
These tags can be added anywhere in the ```template.html``` file.
```
title - the title of the post
body - the html content of the post
author - the author's name (assignee of the issue)
author_url - the author's github url
author_icon_url - the authors github profile icon
time - the time the post was last modified
tags - the tags for the post
```
### Contents
These tags can be added anywhere in the ```contents.html``` file.
```
body - links to all of the posts, dependent on theme
```

## What?
Let's give you a map from issues -> blog
```
issue title -> post title
issue tags -> post category tags
issue assignee -> post author
issue text -> post text
```

## Features
### Current
- markdown -> html support
- html templates for posts and contents
- milligram.github.io css support
- author links and profile images
- post topic tags
- fully hacky CMS using github issues

### Proposed
- proper syntax highlighting for code blocks
- filtering by tag
- full github flavoured markdown support
- username.github.io auto export
- express support
- and probably much more...

## Issues
The current version is mostly hacked together, you can see of the proposed changes in the issues section, or, at the gityll generated page. <a href="http://gityll.club">gityll issues</a>.

## Attribution
<a href="http://subtlepatterns.com/">Subtle Patterns</a> - Awesome minimalist backgrounds for websites.

<a href="http://bettermotherfuckingwebsite.com/">BetterMotherFuckingWebsite</a> - Basis of the alt theme.

<a href="http://pixyll.com/">Pixyll</a> - Heavily inspired alt theme.
