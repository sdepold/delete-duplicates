'use strict';

var fs         = require('fs');
var reportPath = getReportPath();
var groups     = getDuplicateGroups(reportPath);

Object.keys(groups).forEach(function (groupId) {
  var files = groups[groupId];
  var keep  = files[0];
  var remove = files.slice(1);

  console.log('\nGroup ', groupId);
  console.log('+', keep);

  remove.forEach(function (remove) {
    console.log('-', remove);
    fs.unlinkSync(remove);
  });
});

// Local helpers

function getReportPath () {
  var argv = process.argv.slice(2);

  if (argv.length > 1) {
    throw new Error('Unexpected number of arguments!');
  }

  return argv[0];
}

function getDuplicateGroups (reportPath) {
  var report = fs.readFileSync(reportPath, { encoding: 'utf16le' }).toString();
  var lines  = report.split('\n');
  var groups = {};

  lines.forEach(function (line) {
    // console.log(line);
    var match = line.match(/"(.*)".*".*".*"(.*)".*".*".*".*"/);

    if (match) {
      var groupId  = match[1];
      var filePath = match[2];

      groups[groupId] = groups[groupId] || [];
      groups[groupId].push(filePath);
    } else {
      console.log('No match for:', line);
    }
  });

  return groups;
}
