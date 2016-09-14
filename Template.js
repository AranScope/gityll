var fs = require('fs');
var escape = require('escape-html');

Template = function(path) {
	this.template_file = String(fs.readFileSync(path));

	// these matches will have all html escaped.
	this.escape_matches = this.template_file.match(new RegExp('{{[^{}#]*}}', ['g']));
	if(this.escape_matches == null) this.escape_matches = [];

	// these matches will not have html escaped.
	this.non_escape_matches = this.template_file.match(new RegExp('{{{[^{}#]*}}}', ['g']));
	if(this.non_escape_matches == null) this.non_escape_matches = [];

	// these matches are templates themselves.

}

/**
replace all occurances of the given value or regexp with the replace string.

e.g. 'cats,dogs,cats'.replace('cats', 'dogs') -> 'dogs,dogs,dogs'

**/
String.prototype.replaceAll = function(match, replace) {
	var new_string = this;
	var index = new_string.indexOf(match);

	while(index > -1) {
		new_string = new_string.replace(match, replace);
		index = new_string.indexOf(match);
	}

	return new_string;
}



Array.prototype.contains = function(match) {
	return this.indexOf(match) > -1;
}

/**
A context is an object with key-value pairs, used to replace tags in the template document.

e.g.
var context = {
	title: 'new_post',
	author: 'author'
};

**/
Template.prototype.apply = function(context) {
	var new_file = this.template_file;

	// loop through member variables.
	for(var key in context) {
		if(context.hasOwnProperty(key)) {

			// get value of member variable.
			var value = context[key];

			if(this.non_escape_matches.contains('{{{' + key + '}}}')) {
				new_file = new_file.replaceAll('{{{' + key + '}}}', value);
			} else if(this.escape_matches.contains('{{' + key + '}}')) {
				new_file = new_file.replaceAll('{{' + key + '}}', escape(value));

			}  

		}
	}

	return new_file;
}


module.exports = Template;