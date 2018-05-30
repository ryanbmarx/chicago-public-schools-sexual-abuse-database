import getJSDateFromExcel from './get-js-date-from-excel.js';
import {timeFormat} from 'd3-time-format';

module.exports = function formatDate(d, formatString, useAPStyle=true){
	/*
		Takes a datetime object (d) and formats it using d3.timeFormat(). 
		It then, optionally, seeks poorly abbreviated months and replaces 
		them with AP style. If d is an excel date — it happens — then it
		converts the excel date to a JS date.
	*/
	
	const 	date_obj = d instanceof Date ? d : getJSDateFromExcel(d),
			month = date_obj.getMonth();

	let retval = timeFormat(formatString)(date_obj);
	if (useAPStyle){
		switch (month){
			case 0:
				return retval.replace('Jan ', 'Jan. ')
				break;
			case 1:
				return retval.replace('Feb ', 'Feb. ')
				break;
			case 2:
				return retval.replace('Mar ', 'March ')
				break;
			case 3:
				return retval.replace('Apr ', 'April ')
				break;
			// case 4:
			// 	return retval.replace('May ', 'May ')
			// 	break;
			case 5:
				return retval.replace('Jun ', 'June ')
				break;
			case 6:
				return retval.replace('Jul ', 'July ')
				break;
			case 7:
				return retval.replace('Aug ', 'Aug. ')
				break;
			case 8:
				return retval.replace('Sep ', 'Sept. ')
				break;
			case 9:
				return retval.replace('Oct ', 'Oct. ')
				break;
			case 10:
				return retval.replace('Nov ', 'Nov. ')
				break;
			case 11:
				return retval.replace('Dec ', 'Dec. ')
				break;
		}
	}
	return retval;
}