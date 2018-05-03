const pym = require('pym.js');
// Listen for the loaded event then run the pym stuff.
window.addEventListener('load', function(e){
	console.log("pym, yo")
	window.pymChild = new pym.Child({});
	// pymChild.sendMessage('childLoaded');
	window.pymChild.sendHeight();
});