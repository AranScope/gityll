# gityll
Transform your issues into a blog.

Take a look at my site <a href="http://aranlong.co.uk/contents">here</a> for an example.

The issues page used to generate this can be found <a href="https://github.com/AranScope/test-repo/issues">here</a>

The current version is super hacky, you can see what I plan on changing (pretty much everything) in the issues section.

## Basics
gityll is a static site generator that uses the github issues system as a CMS. Point gityll at a repo and you're off. 

## What?
Let's give you a map from issues -> blog
```
issue title -> post title
issue tags -> post category tags
issue assignee -> post author
issue text -> post text
```

## Features
- markdown -> html support
- html templates for posts and contents
- milligram.github.io css support
- author links and profile images
- post topic tags
- fully hacky CMS using github issues
