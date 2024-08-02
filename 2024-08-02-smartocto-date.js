
/* this version of the code works okay but it still needs to separate the author name from the article_authors array */

/* function to create a new apps script menu on open */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('daisy-thunder')
    .addItem('pull smartocto data','smartocto_data')
    .addToUi();
}

/* function to pull data from Smartocto service and put it into a spreadsheet*/

function smartocto_data() {
  var url = "https://api.contentinsights.com/v2/stats?dimension=article&domain_id=2682&date_from=2024-08-01&date_to=2024-08-01&limit=1000&api_key=b6a9d99ce963de43872ce66ac6c76f9a53d99de2"; // API request string

  var api_response = UrlFetchApp.fetch(url); //UrlFetchApp Class gets the JSON from Smartocto

  //Logger.log(api_response.getContentText()); //send JSON response to debugging log to check if the API request was successful

  var sm_dataset = JSON.parse(api_response.getContentText()); // parse the JSON data into an Apps Script Object
  var sm_sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); //get active sheet
  Logger.log(sm_dataset.data[1].article_id); // scaffolding: checking a single value of article_id - not required
  Logger.log(sm_dataset.data.length); // scaffolding: checking a the number of table rows - not required for program
  for (var iterator = 0; iterator < sm_dataset.data.length; iterator++) {
    sm_sheet.getRange(iterator+1,1).setValue(sm_dataset.data[iterator].article_id)
    sm_sheet.getRange(iterator+1,2).setValue(sm_dataset.data[iterator].article_create_date)
    sm_sheet.getRange(iterator+1,3).setValue(sm_dataset.data[iterator].article_url)
    sm_sheet.getRange(iterator+1,4).setValue(sm_dataset.data[iterator].article_title)
    sm_sheet.getRange(iterator+1,5).setValue(sm_dataset.data[iterator].article_authors)
  }
}
