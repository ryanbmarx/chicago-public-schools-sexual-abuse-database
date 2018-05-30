import 'awesomplete';
import clickTrack from "./click-track.js";
// import getJSDateFromExcel from './get-js-date-from-excel.js';
// import {timeFormat} from 'd3-time-format';
import formatDate from "./format-date.js";

const pym = require('pym.js');

// Listen for the loaded event then run the pym stuff.
window.addEventListener('load', function(e){
	window.pymChild = new pym.Child({});
	// pymChild.sendMessage('childLoaded');
	window.pymChild.sendHeight();
});


window.addEventListener('load', function(e){
	// console.log("Window is onloaded");
	// console.log('schools', window.schools);
	// console.log('reports', window.policeReports);


	// ----------------------------
    // AUTOCOMPLETE ---------------
    // ----------------------------

	const 	form = document.querySelector("#abuse-lookup"),
			searchBar = form.querySelector("input"),
			submitButton = form.querySelector("button[type='submit']"),
			profilesContainer = document.querySelector('.profiles');

	// This is the autocomplete tool. It needs the `list` attribute
	// to be filled with autocomplete options. We'll do that with a 
	// window variable templated with Jinja on the index page.
	
	const auto = new Awesomplete(searchBar, {
		minChars: 2,
		maxItems: 20,
		autoFirst: true,
		list: getSchoolsList(window.policeReports)
	});

	submitButton.addEventListener('click', function(e) {
		// We don't need the button to do anything.
		e.preventDefault();
	})

	window.addEventListener('awesomplete-selectcomplete', function(e) {
		
		makeProfiles(e.text.value, profilesContainer);

		// Trigger an omniture link track
		clickTrack('CPS Abuse - school lookup search');
	});

	// window.addEventListener('awesomplete-open', e => {
	// 	console.log("popup has appeared")
	// 	window.pymChild.sendHeight()
	// });
	// window.addEventListener('awesomplete-close', e => window.pymChild.sendHeight());
})

function getSchoolsList(policeReports){
	const retval = new Set();

	for (var report of policeReports){
		retval.add(report['SCHOOL_NAME']);
	} 
	return Array.from(retval);
}

function makeProfiles(schoolName, profilesContainer){
	const profilesData = searchDatabase(schoolName)
		.then(function(profilesData){

			const 	reportReports = profilesData.length > 1 ? "reports" : "report",
					colocated = profilesData[0].COLOCATED == 1 ? true : false, 
					isUnknown = profilesData[0].SCHOOL_NAME.toUpperCase() == "UNKNOWN" || profilesData[0].SCHOOL_TYPE.toUpperCase() == "UNK" ? true : false,
					schoolType = isUnknown ? "" : profilesData[0].SCHOOL_TYPE;



			let parsedProfiles = `<h1 class='profiles__school-name'>${schoolName}</h1>
				<p class='profiles__total-records'>${profilesData.length} ${reportReports} for this ${schoolType} school:</p>
				<table><thead>
				<tr>
					<th class='date'>Date</th>
					<th>Description</th>
					<th class='arrests'>Arrest made?</th>
				</tr>`;
			
			if (colocated) parsedProfiles += `<figure class='note note--colocated'>
					<figcaption>${window.noteColocatedHeader}</figcaption>
					<p>${window.noteColocated}</p>
				</figure>`;

			if (isUnknown) parsedProfiles += `<figure class='note note--unknown'>
					<figcaption>${window.noteUnknownHeader}</figcaption>
					<p>${window.noteUnknown}</p>
				</figure>`;

			for (var p of profilesData){
				parsedProfiles += makeProfile(p);
			}

			// console.log(parsedProfiles);
			profilesContainer.innerHTML = parsedProfiles;			
		})
		.then(function(){
			// console.log('sending height');
			document.querySelector('body').dataset.selectionMade = true;
			window.pymChild.sendHeight();
		});

}

function makeProfile(record){
	let 	arrestMade = "No",
			addClass = "";
	if (record.ARREST == 1){
		arrestMade = "Yes";
		addClass = "profile--arrest"
	};
	// const formattedDate = timeFormat("%b %-d, %Y")(getJSDateFromExcel(record.DATE));
	const formattedDate = formatDate(record.DATE, "%b %-d, %Y", true);

	return `<tr class='profile ${ addClass }'>
				<td class='date'>${ formattedDate }</td>
				<td><strong>${ record.PRIMARY_TYPE } - </strong>${ record.DESCRIPTION }</td>
				<td class='arrests'>${ arrestMade }</td></tr>`;
}

function searchDatabase(schoolName){

	return new Promise(function(resolve, reject){
		console.log(`searching for ${schoolName}`);
		const foundTheseReports = []; // The holder for our resultant schools
		let foundSchools = false;

		for (var r of window.policeReports){
			if (foundSchools && r["SCHOOL_NAME"].toUpperCase() != schoolName.toUpperCase()) {
				// Since the crimes data is sorted, we can assume that if we have found 
				// at least one school (foundSchools = true) and the name no longer matches
				// the school we are looking for, then we can quit because we have found 
				// all the crime reports there are to find.

				resolve(foundTheseReports.sort(function(a,b){
					// Sort the array by excel date, earliest first.
					return a.DATE - b.DATE;
				}));
			} else if (r.SCHOOL_NAME.toUpperCase() == schoolName.toUpperCase()){
				// We only end up here, adding to our list of reports, if we haven't found anything
				// yet or the name still matches.
				foundTheseReports.push(r);
				foundSchools = true;
			}
		}
		reject('Never found anything. Sorry.');
	});
}