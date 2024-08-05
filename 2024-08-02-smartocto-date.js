/*
FUN with MATH API
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('daisy-thunder')
    .addItem('display random number fact','callNumbers')
    .addToUi();
}

function callNumbers() {
  //call the numbers API for a random maths fact
  var response = UrlFetchApp.fetch('http://numbersapi.com/random/math'); //URL Fetch Service
  Logger.log(response.getContentText());

  var fact = response.getContentText();
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(sheet.getLastRow()+ 1,1).setValue([fact]);
} */

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
  var url = "https://api.contentinsights.com/v2/stats?dimension=article&domain_id=2682&date_from=2024-01-01&date_to=2024-06-30&limit=100000&api_key=b6a9d99ce963de43872ce66ac6c76f9a53d99de2"; // API request string

  var api_response = UrlFetchApp.fetch(url); //UrlFetchApp Class gets the JSON from Smartocto

  //Logger.log(api_response.getContentText()); //send JSON response to debugging log to check if the API request was successful

  var sm_dataset = JSON.parse(api_response.getContentText()); // parse the JSON data into an Apps Script Object
  var sm_sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); //get active sheet
  Logger.log(sm_dataset.data[1].article_id); // scaffolding: checking a single value of article_id - not required
  Logger.log(sm_dataset.data.length); // scaffolding: checking a the number of table rows - not required for program
  
  /* writing the table into the active sheet*/
  for (var iterator = 0; iterator < sm_dataset.data.length; iterator++) {
    sm_sheet.getRange(iterator+2,1).setValue(sm_dataset.data[iterator].article_id);             // article id - column 1
    sm_sheet.getRange(iterator+2,2).setValue(sm_dataset.data[iterator].article_create_date);    // article create date - column 2
    sm_sheet.getRange(iterator+2,3).setValue(sm_dataset.data[iterator].article_url);            // article url - column 3
    sm_sheet.getRange(iterator+2,4).setValue(sm_dataset.data[iterator].article_title);          // article title - column 4
    var sections = sm_dataset.data[iterator].article_sections;                                  // get article sections sub-table - write as column 5
    var section_names = sections.map(function(section) {
      return section.name;
    }).join(', ');
    sm_sheet.getRange(iterator+2,5).setValue(section_names);

    var authors = sm_dataset.data[iterator].article_authors;                                    // get article authors sub-table - write as column 6
    var author_names = authors.map(function(author) {
      return author.name;
    }).join(', ');
    sm_sheet.getRange(iterator+2,6).setValue(author_names);
  
    var topics = sm_dataset.data[iterator].article_topics;                                    // get article topics sub-table - write as column 7
    var topic_names = topics.map(function(topic) {
      return topic.name;
    }).join(', ');
    sm_sheet.getRange(iterator+2,7).setValue(topic_names);
    sm_sheet.getRange(iterator+2,8).setValue(sm_dataset.data[iterator].article_pid);          // article Publisher ID - column 8
    sm_sheet.getRange(iterator+2,9).setValue(sm_dataset.data[iterator].article_word_count);   // article word count - column 9
    sm_sheet.getRange(iterator+2,10).setValue(sm_dataset.data[iterator].read_depth);          // read depth - column 10
    sm_sheet.getRange(iterator+2,11).setValue(sm_dataset.data[iterator].page_depth);          // page depth - column 11
    sm_sheet.getRange(iterator+2,12).setValue(sm_dataset.data[iterator].attention_minutes_average);       // average attention minutes - column 12
    
    /* set and hardcode month formula */
    var month_formula = `=EOMONTH(B${iterator+2},0)`        
    sm_sheet.getRange(iterator+2,13).setFormula(month_formula)
    var cell = sm_sheet.getRange(iterator+2,13)
    var value = cell.getValue()
    cell.setValue(value)

    /* set and hardcode key theme formula 14*/
    var month_formula = `=IF( LEN(
      IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"safety-and-belonging"),"-"," ")&" ","")
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"age-of-accountability"),"-"," ")&" ","")
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"learning-and-job-creation"),"-"," ")&" ","")
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"a-sustainable-world"),"-"," "),"") )=0
      ,"no theme", 
      (IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"safety-and-belonging"),"-"," ")&" ","")
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"age-of-accountability"),"-"," ")&" ","")
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"learning-and-job-creation"),"-"," ")&" ","")
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"a-sustainable-world"),"-"," "),"") ) )`       
    sm_sheet.getRange(iterator+2,14).setFormula(month_formula)
    var cell = sm_sheet.getRange(iterator+2,14)
    var value = cell.getValue()
    cell.setValue(value)

    /* set and hardcode user need formula - column 15*/
    var month_formula = `=IF( LEN( 
      IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"give-me-perspective"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"update-me"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"keep-me-on-trend"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"inspire-me"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"divert-me"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"educate-me"),"-"," ")&" ","") )=0
      , "no user need", 
      ( IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"give-me-perspective"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"update-me"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"keep-me-on-trend"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"inspire-me"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"divert-me"),"-"," ")&" ","") 
      &IFERROR(SUBSTITUTE(REGEXEXTRACT($G${iterator+2},"educate-me"),"-"," ")&" ","") ) )`       
    sm_sheet.getRange(iterator+2,15).setFormula(month_formula)
    var cell = sm_sheet.getRange(iterator+2,15)
    var value = cell.getValue()
    cell.setValue(value)
  }
}
