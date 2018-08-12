var request = require('request');
var cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');
const fs = require('fs');

//var url = 'http://www.calottery.com/play/scratchers-games/$5-scratchers/pure-gold-1287';
var url = 'http://www.calottery.com/play/scratchers-games/$3-scratchers/cold-hard-cash-1286';

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var data;
    var $ = cheerio.load(html);
    var scrape = $('table.draw_games.tag_even');
    var str = scrape.toString();
    var tables = str.replace('</table><table', '</table>*');
    var table1 = tables.split('*')[0];
    str = table1.toString();
    var split = str.replace('<tbody>', '*').replace('</tbody>', '*');
    var rows = split.split('*')[1];
    var rowString = rows.toString();
    // OK HERE UP

    rowString = replaceAll(rowString, ' ', '');
    rowString = replaceAll(rowString, '$', '');
    rowString = replaceAll(rowString, ',', '');
    rowString = replaceAll(rowString, 'n', '');

    rowString = replaceAll(rowString, '</tr><tr>', '*');
    rowString = replaceAll(rowString, '</td><td>', '@');

    rowString = replaceAll(rowString, '<td>', '');
    rowString = replaceAll(rowString, '</td>', '');
    rowString = replaceAll(rowString, '<tr>', '');
    rowString = replaceAll(rowString, '</tr>', '');

    var splitRows = rowString.split('*');
    //console.log(splitRows.length);
    var rowCount = splitRows.length;
    var dataRows = [rowCount];
    //console.log(dataRows);
    for (var i = 0; i < splitRows.length; i++) {
      dataRows[i] = splitRows[i].toString().split('@');
    }

    var DATA = [rowCount];
    for (var i = 0; i < dataRows.length; i++) {
      var ROW = dataRows[i];
      for (var j = 0; j < ROW.length; j++) {
        console.log(ROW[j]);
      }
    }
      /*
var json = { prize : "", odds1In : "", totalWinners : "", claimed : "", available : ""};
}*/

    function replaceAll(str, find, replace) {
      return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    function escapeRegExp(str) {
      return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    fs.writeFile('5_Dolla_Data.txt', dataRows, function (err) {
      if (err) return console.log(err);
    });
  }
});
