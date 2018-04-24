module.exports = function clickTrack(uniquePhrase){
	console.log(uniquePhrase);
	try{
		s.linkTrackVars = "server,prop3,prop20,prop28,prop33,prop34,prop57,eVar3,eVar20,eVar21,eVar34,eVar35,eVar36,eVar37,eVar38,eVar39,eVar51";
		s.linkTrackEvents = "";
		s.prop57 = uniquePhrase;
		s.tl(
		// Natty said use "this"
		  this,
		   // linkType, 'o' for custom link
		   'o',
		   // linkName
			uniquePhrase,
		   // variableOverrides
		   null
		);
	}
	catch (ReferenceError){
		console.warn('You must be running this locally. *OR* Omniture is not loaded. Skipping analytics.');
	}
}