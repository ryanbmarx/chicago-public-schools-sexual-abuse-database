const pym = require('pym.js');
// Listen for the loaded event then run the pym stuff.
window.addEventListener('DOMContentLoaded', function(e){
	console.log("pym, yo, stap")
	window.pymChild = new pym.Child({});
	// pymChild.sendMessage('childLoaded');
	window.pymChild.sendHeight();
});

window.addEventListener('load', function(e){
	window.pymChild.sendHeight();
});