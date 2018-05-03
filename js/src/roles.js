const pym = require('pym.js');

window.addEventListener('load', function(e){

// Listen for the loaded event then run the pym stuff.
window.addEventListener('load', function(e){
	window.pymChild = new pym.Child({});
	// pymChild.sendMessage('childLoaded');
	window.pymChild.sendHeight();
});