const csv = require('csv-parser')
const fs = require('fs');
const json2csvParser = require('json2csv')
const rawResults = [];
const cleanedResults = [];

class Row {

}

fs.createReadStream('./tabn318.30.csv')
.pipe(csv())
.on('data', data => rawResults.push(data))
.on('end', () => {
  for (let i=0; i < rawResults.length; i++) {
    const major = rawResults[i].Major
    if(major.length === 0) continue;
    let nextMajor = null;
    if (i + 1 < rawResults.length) {
      nextMajor = rawResults[i+1].Major
    }
    const leftSpaceMajor = major.length - major.replace(/^\s*/, '').length
    const leftSpaceNextMajor = nextMajor ? nextMajor.length - nextMajor.replace(/^\s*/, '').length : null
    // if next one has more padding do not add
    const nextMajorHasMorePadding = leftSpaceNextMajor && (leftSpaceNextMajor - leftSpaceMajor) > 0 
    if(!nextMajorHasMorePadding) {
      const cleanedResult = new Row();
      const rawResult = rawResults[i];
      cleanedResult.Major = major.replace(/^\s*/, '').replace(/\s\.*$/, '').replace("\"", '').replace("\"", "")
      console.log(cleanedResult.Major)
      for(let property in rawResult) {
        if (property !== 'Major') {
          let value =  + rawResult[property]
          cleanedResult[property] = value
        }
      }
      cleanedResults.push(cleanedResult)
    }
  }
  const cleanedResultsCSV = json2csvParser.parse(cleanedResults, {
    quote: '',
    doubleQuote: '',
    delimiter: '\t'
  });
  fs.writeFileSync('student-majors.csv', cleanedResultsCSV);
})

