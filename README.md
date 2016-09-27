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

```
1. git clone https://github.com/aranscope/gityll
2. cd gityll
3. npm install
4. npm start [port] [repo url]
```

### Advanced
```
1. cd gityll/templates
2. customise these templates
3. cd ../static
4. customise the style.css
5. cd ..
6. npm start [port] [repo url]
```

### Webhooks
Go to your repo on github, go to settings, webhooks.

Add a new webhook pointing to yourip/issue that will be triggered when an issue is updated or commented on.

This will mean posts can be updated without restarting the server.

### Debugging
With certain hosts, ec2 for example, you may run into issues running on certain ports. In some cases you may need to run as sudo (but very rarely) or forward certain ports with your host.

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
<a href="http://bettermotherfuckingwebsite.com/">BetterMotherFuckingWebsite</a> - Basis of the alt theme.

<a href="http://pixyll.com/">Pixyll</a> - Heavily inspired theme.
