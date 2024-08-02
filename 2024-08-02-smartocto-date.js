/* function to pull data from Smartocto service and put it into a spreadsheet*/
function smartocto_data() {
  var url = "https://api.contentinsights.com/v2/stats?dimension=article&domain_id=2682&date_from=2024-08-01&date_to=2024-08-01&api_key=b6a9d99ce963de43872ce66ac6c76f9a53d99de2"; // API request string
  var response = UrlFetchApp.fetch(url); //UrlFetchApp Class gets the JSON from Smartocto
  Logger.log(response.getContentText());
}
