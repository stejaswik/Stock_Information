// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  // Get the Sidebar
  var mySidebar = document.getElementById("mySidebar");

  // Get the DIV with overlay effect
  var overlayBg = document.getElementById("myOverlay");
  if (mySidebar.style.display === "block") {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = "block";
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  // Get the Sidebar
  var mySidebar = document.getElementById("mySidebar");

  // Get the DIV with overlay effect
  var overlayBg = document.getElementById("myOverlay");
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}

function add_stock(stock) {
  var myStock;
  if (stock === "VSI") {
    // Run this for "View Stock Information"
    myStock = document.getElementById("inputStock").value; // Store Input field value to variable for further processing
  } // Run this for default stock options
  else {
    myStock = stock;
    document.getElementById("inputStock").value = ""; // Clear Input field when not in use
  }

  var myCookie = Cookies.get("stockList");
  var stockList;
  if(myCookie) {
    stockList = Cookies.get("stockList");
    if(!stockList.includes(myStock)) {
      stockList += "," + myStock;
    }
    Cookies.set("stockList", stockList, {expires: 365});
  }
  else {
    alert("ERROR");
  }
  location.reload();
}

function make_page() {
  var myDiv = document.getElementById("stock_boxes");
  var myCookie = Cookies.get("stockList");
  var stockList;
  if(myCookie) {
    stockList = Cookies.get("stockList");
  }
  else {
    stockList = "AAPL,SPY,AMZN,VOO,MSFT";
    Cookies.set('stockList', stockList, {expires: 365});
  }

  var colors = ["red", "pink", "purple", "indigo", "blue", "cyan", "aqua", "teal", "green", "lime", "sand", "khaki", "yellow", "amber", "orange", "brown", "gray"];

  var stockArray = stockList.split(",");
  for(var i = 0; i < stockArray.length; i++) {
    var iDiv = document.createElement('input');
    iDiv.style = "height: 80px";
    iDiv.className = '"w3-tenth w3-container w3-button w3-' + colors[Math.floor(Math.random() * colors.length)] + ' w3-padding-large w3-hover-black"';
    iDiv.type = "submit";
    iDiv.id = stockArray[i];
    iDiv.value = stockArray[i];
    iDiv.onclick = function() { get_stock_info(this.id); };
    myDiv.appendChild(iDiv);
    
  }
}

//Used to retrieve stock information and On load function call it displays default stock ("BABA")
function get_stock_info(stock) {
  var myStock;
  if (stock === "VSI") {
    // Run this for "View Stock Information"
    // alert("IN IF");
    myStock = document.getElementById("inputStock").value; // Store Input field value to variable for further processing
  } // Run this for default stock options
  else {
    // alert("IN ELSE");
    myStock = stock;
    document.getElementById("inputStock").value = ""; // Clear Input field when not in use
  }

  //Display selected stock next to Stock heading
  var heading = document.getElementById("stockName");
  heading.innerHTML = " Stock: " + myStock;

  //Display selected stock next to Dashboard heading
  var heading1 = document.getElementById("dashboardStock");
  heading1.innerHTML = " Dashboard: " + myStock;

  //Default financials table view should be displayed to the user
  var x = document.getElementById("financialsTable");
  //x.style.display = "block";

  //Default financials view should be displayed in nav bar
  var y = document.getElementById("financialDisp");
  y.style.display = "block";

  //Retrieve MACD, RSI and Financials
  macdRsi(myStock);
  // compFinancials(myStock);
}

//Computes and Displays values into MACD, RSI, Deduction Tables
function macdRsi(myStock) {
  //remove previous data from MACD table
  var Parent = document.getElementById("macdTable");
  while (Parent.hasChildNodes()) {
    Parent.removeChild(Parent.firstChild);
  }
  //remove previous data from Deductions table
  var Parent = document.getElementById("deductionsTable");
  while (Parent.hasChildNodes()) {
    Parent.removeChild(Parent.firstChild);
  }
  //remove previous data from RSI table
  var Parent = document.getElementById("rsiTable");
  while (Parent.hasChildNodes()) {
    Parent.removeChild(Parent.firstChild);
  }
  // //remove previous data from financials table
  // var Parent = document.getElementById("financialsTable");
  // while (Parent.hasChildNodes()) {
  //   Parent.removeChild(Parent.firstChild);
  // }

  var time = 12; //MACD Short Time
  var timeLng = 26; //MACD Long Time
  var sigLine = 9; //MACD Signal Line Time
  var timeRsi = 14; //RSI Time

  //Construct API request
  req = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";
  req = req.concat(myStock, "&apikey=HPXZ2S6SQX1LMF8E");

  var wsreq = new XMLHttpRequest();
  //Code to retrieve API Response
  wsreq.open("GET", req, true);
  wsreq.send();
  wsreq.onreadystatechange = function () {
    //Once there is a response from the API
    if (this.readyState == 4 && this.status == 200) {
      var RspCsv = wsreq.responseText;
      //Error handling in case of an invalid stock input
      if (RspCsv.search("Error Message") >= 0) {
        alert("Please enter a valid stock ticker");
        get_stock_info("BABA");
        return;
      }

      //Displaying Date and closing value MACD Table
      var obj = JSON.parse(RspCsv);
      obj = obj["Time Series (Daily)"];
      i = 0;
      j = 0;
      var arrClose = [];
      var arrDate = [];
      var arrVolume = [];
      numDays = Object.keys(obj).length;
      Object.keys(obj).forEach(function (key) {
        keys = Object.keys(obj);
        date = keys[j];
        closingPrice = obj[date]["4. close"];
        volume = obj[date]["5. volume"];

        arrClose[j] = closingPrice;
        arrDate[j] = date;
        arrVolume[j] = volume;
        j++;
      });

      //Calculate change value for RSI
      var arrChange = [];
      for (k = 0; k < numDays - 1; k++) {
        ChangeActual = arrClose[k] - arrClose[k + 1];
        arrChange[k] = ChangeActual.toFixed(2);
      }

      //Calculate Avg Gain or Loss
      dataptLastAvg = numDays - 1 - timeRsi; // Should start from this value and go till "dataptLastAvg+timeRsi+1"
      var arrAvggain = [];
      var arrAvgloss = [];
      for (l = dataptLastAvg; l > 0; l--) {
        Changesumgain = 0;
        Changesumloss = 0;

        if (l == dataptLastAvg) {
          for (i = l; i < l + timeRsi; i++) {
            if (arrChange[i] >= 0) {
              Changesumgain = +Changesumgain + +arrChange[i];
            } else {
              ChangeAbs = -1 * arrChange[i];
              Changesumloss = +Changesumloss + +ChangeAbs;
            }
          }
          AvggainActual = Changesumgain / timeRsi;
          arrAvggain[l] = AvggainActual.toFixed(2);
          AvglossActual = Changesumloss / timeRsi;
          arrAvgloss[l] = AvglossActual.toFixed(2);
        } else {
          weightAvgRsi = timeRsi - 1;
          if (arrChange[l] < 0) {
            AvggainActual = (+weightAvgRsi * arrAvggain[l + 1]) / timeRsi;
            arrAvggain[l] = AvggainActual.toFixed(2);
            AvglossActual =
              (+weightAvgRsi * arrAvgloss[l + 1] + -1 * arrChange[l]) / timeRsi;
            arrAvgloss[l] = AvglossActual.toFixed(2);
          } else {
            AvggainActual =
              (+weightAvgRsi * arrAvggain[l + 1] + +arrChange[l]) / timeRsi;
            arrAvggain[l] = AvggainActual.toFixed(2);
            AvglossActual = (+weightAvgRsi * arrAvgloss[l + 1]) / timeRsi;
            arrAvgloss[l] = AvglossActual.toFixed(2);
          }
        }
      }
      //Calculate RSI
      dataptLastAvg = numDays - 1 - timeRsi;
      var arrRSI = [];
      for (m = dataptLastAvg; m > 0; m--) {
        gainlossRatio = arrAvggain[m] / arrAvgloss[m];
        RsiActual = 100 - 100 / (1 + gainlossRatio);
        arrRSI[m] = RsiActual.toFixed(2);
      }

      //MACD Calculaiton:
      //Calculate EMA Short
      var arrEMAShrt = [];
      dataptLast = numDays - time - 1;
      for (g = dataptLast; g > 0; g--) {
        if (g == dataptLast) {
          var TempVal = 0;
          a = time - 1; // time=12
          for (i = dataptLast; i <= dataptLast + a; i++) {
            Close = arrClose[i];
            TempVal = +Close + +TempVal; // Conversion to int
          }
          EMAShrtActual = TempVal / time;
          arrEMAShrt[g] = EMAShrtActual.toFixed(2); // rounding to 2 decimal places
        } else {
          weightAvg = 2 / (+time + +1);
          EMAShrtActual =
            arrClose[g] * weightAvg + arrEMAShrt[g + 1] * (1 - weightAvg);
          arrEMAShrt[g] = EMAShrtActual.toFixed(2);
        }
      }

      //Calculate EMA Long
      var arrEMALong = [];
      dataptLastLng = numDays - timeLng - 1;
      for (h = dataptLastLng; h > 0; h--) {
        if (h == dataptLastLng) {
          var TempVal = 0;
          a = timeLng - 1; // time=26
          for (i = dataptLastLng; i <= dataptLastLng + a; i++) {
            Close = arrClose[i];
            TempVal = +Close + +TempVal; // Conversion to int
          }
          EMALongActual = TempVal / timeLng;
          arrEMALong[h] = EMALongActual.toFixed(2); // rounding to 2 decimal places
        } else {
          weightAvg = 2 / (+timeLng + +1);
          EMALongActual =
            arrClose[h] * weightAvg + arrEMALong[h + 1] * (1 - weightAvg);
          arrEMALong[h] = EMALongActual.toFixed(2);
        }
      }

      //Calculate MACD
      var arrMacd = [];
      for (u = dataptLastLng; u > 0; u--) {
        EMAShrt = arrEMAShrt[u];
        EMALng = arrEMALong[u];
        macdActual = EMAShrt - EMALng;
        arrMacd[u] = macdActual.toFixed(2);
      }

      //Calculate Signal Line
      dataptLastSigLine = numDays - timeLng - sigLine;
      var arrSigLine = [];
      for (j = dataptLastSigLine; j > 0; j--) {
        if (j == dataptLastSigLine) {
          var TempVal = 0;
          //number of data points
          a = sigLine - 1;

          //calculate avg for last n data pts.
          for (i = dataptLastSigLine; i <= dataptLastSigLine + a; i++) {
            TempVal = +arrMacd[i] + +TempVal;
          }

          SigValueActual = TempVal / sigLine;
          arrSigLine[j] = SigValueActual.toFixed(2);
        } else {
          sigLineWeightAvg = 2 / (+sigLine + +1); //sigLine=9
          SigValueActual =
            arrMacd[j] * sigLineWeightAvg +
            arrSigLine[j + 1] * (1 - sigLineWeightAvg);
          arrSigLine[j] = SigValueActual.toFixed(2);
        }
      }

      //Calculate Indicator Value
      var arrIndicator = [];
      for (j = dataptLastSigLine; j > 0; j--) {
        IndicatorValueActual = arrMacd[j] - arrSigLine[j];
        arrIndicator[j] = IndicatorValueActual.toFixed(2);
      }

      //Create Graphs
      var chart = c3.generate({
        bindto: "#chart",
        data: {
          xs: {
            MACD: "date",
            "Signal Line": "date",
          },
          columns: [
            [
              "date",
              arrDate[1],
              arrDate[2],
              arrDate[3],
              arrDate[4],
              arrDate[5],
            ],
            [
              "MACD",
              arrMacd[1],
              arrMacd[2],
              arrMacd[3],
              arrMacd[4],
              arrMacd[5],
            ],
            [
              "Signal Line",
              arrSigLine[1],
              arrSigLine[2],
              arrSigLine[3],
              arrSigLine[4],
              arrSigLine[5],
            ],
          ],
          type: "spline",
        },

        axis: {
          y: {
            tick: {
              format: d3.format(".2f"),
            },
          },

          x: {
            type: "timeseries",
            tick: {
              format: "%d-%m",
              fit: true,
            },
          },
        },

        padding: {
          right: 20,
          left: 40,
        },
      });

      //Display Closing Value vs Date graph
      var chart = c3.generate({
        bindto: "#chart2",
        data: {
          xs: {
            "Closing Value": "date",
          },
          columns: [
            [
              "date",
              arrDate[1],
              arrDate[2],
              arrDate[3],
              arrDate[4],
              arrDate[5],
            ],
            [
              "Closing Value",
              arrClose[1],
              arrClose[2],
              arrClose[3],
              arrClose[4],
              arrClose[5],
            ],
          ],
          type: "spline",
          colors: {
            "Closing Value": "#ff0000",
          },
        },

        axis: {
          y: {
            tick: {
              format: d3.format(".2f"),
            },
          },

          x: {
            type: "timeseries",
            tick: {
              format: "%d-%m",
              fit: true,
            },
          },
        },

        padding: {
          right: 20,
          left: 40,
        },
      });

      //Create MACD Headers
      var tableref = document.getElementById("macdTable");
      newRow = tableref.insertRow(0);
      newCell0 = newRow.insertCell(0);
      newCell0.innerHTML = "Date".italics();
      newCell0.className = "w3-text-blue w3-large";
      newCell0.id = "date";

      newCell0 = newRow.insertCell(1);
      newCell0.innerHTML = "Closing Price".italics();
      newCell0.className = "w3-text-red w3-large";
      newCell0.id = "price";

      newCell0 = newRow.insertCell(2);
      newCell0.innerHTML = "MACD".italics();
      newCell0.className = "w3-text-blue w3-large";
      newCell0.id = "macdvalue";

      newCell0 = newRow.insertCell(3);
      newCell0.innerHTML = "Indicator".italics();
      newCell0.className = "w3-text-red w3-large";
      newCell0.id = "indicator";

      //Create RSI Headers
      var tableref2 = document.getElementById("rsiTable");
      newRow2 = tableref2.insertRow(0);
      newCell2 = newRow2.insertCell(0);
      newCell2.innerHTML = "Date".italics();
      newCell2.className = "w3-text-blue w3-large";
      newCell2.id = "datersi";

      newCell2 = newRow2.insertCell(1);
      newCell2.innerHTML = "Volume".italics();
      newCell2.className = "w3-text-red w3-large";
      newCell2.id = "volumersi";

      newCell2 = newRow2.insertCell(2);
      newCell2.innerHTML = "Average Gain".italics();
      newCell2.className = "w3-text-blue w3-large";
      newCell2.id = "avggainrsi";

      newCell2 = newRow2.insertCell(3);
      newCell2.innerHTML = "Average Loss".italics();
      newCell2.className = "w3-text-red w3-large";
      newCell2.id = "avglossrsi";

      //Create Deductions Headers
      var tableref3 = document.getElementById("deductionsTable");
      newRow3 = tableref3.insertRow(0);
      newCell3 = newRow3.insertCell(0);
      newCell3.innerHTML = "Date".italics();
      newCell3.className = "w3-text-blue w3-large";
      newCell3.id = "date";

      newCell3 = newRow3.insertCell(1);
      newCell3.innerHTML = "MACD Indicator".italics();
      newCell3.className = "w3-text-red w3-large";
      newCell3.id = "macdIndicator";

      newCell3 = newRow3.insertCell(2);
      newCell3.innerHTML = "RSI Value".italics();
      newCell3.className = "w3-text-blue w3-large";
      newCell3.id = "rsiValue";

      for (j = 6; j > 0; j--) {
        //Create MACD table
        var newRow = tableref.insertRow(1);
        newCell0 = newRow.insertCell(0);
        newCell0.innerHTML = arrDate[j];

        newCell0 = newRow.insertCell(1);
        newCell0.innerHTML = arrClose[j];

        newCell0 = newRow.insertCell(2);
        newCell0.innerHTML = arrMacd[j];

        newCell0 = newRow.insertCell(3);
        newCell0.innerHTML = arrIndicator[j];

        //Create RSI table
        var newRow = tableref2.insertRow(1);
        newCell0 = newRow.insertCell(0);
        newCell0.innerHTML = arrDate[j];

        newCell0 = newRow.insertCell(1);
        newCell0.innerHTML = arrVolume[j];

        newCell0 = newRow.insertCell(2);
        newCell0.innerHTML = arrAvggain[j];

        newCell0 = newRow.insertCell(3);
        newCell0.innerHTML = arrAvgloss[j];

        //Create Deductions table
        var newRow = tableref3.insertRow(1);
        newCell0 = newRow.insertCell(0);
        newCell0.innerHTML = arrDate[j];

        newCell0 = newRow.insertCell(1);
        if (arrIndicator[j] > 0.05) {
          disp1 = "BUY";
        } else if ((-0.05 < arrIndicator[j]) & (arrIndicator[j] < 0.05)) {
          disp1 = "CLOSE TO REVERSAL";
        } else {
          disp1 = "SELL";
        }
        newCell0.innerHTML = disp1;

        newCell0 = newRow.insertCell(2);
        if (arrRSI[j] > 70) {
          newCell0.style.color = "red";
        } else if (arrRSI[j] < 30) {
          newCell0.style.color = "green";
        }
        newCell0.innerHTML = arrRSI[j + 1];
      }
    }
  };
}
//Populate financials table for selected stocks
// function compFinancials(myStock) {
//   var comp = myStock;
//   var req = "https://financialmodelingprep.com/api/v3/income-statement/";
//   req = req.concat(
//     comp,
//     "?period=quarter&limit=400&apikey=3c5ff050c44b6fdee60b580c7bb8021a"
//   );
//   var wsreq = new XMLHttpRequest();
//   wsreq.open("GET", req, true);
//   wsreq.send();
//   wsreq.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       var RspCsv = wsreq.responseText; //API Response as String
//       var obj = JSON.parse(RspCsv); //Parse API Response as JSON
//       //Loop through each key of the JSON value
//       var a = 0;
//       var table = document.getElementById("financialsTable");
//       var row = table.insertRow(0);
//       var cell1 = row.insertCell(0);
//       cell1.innerHTML = "Date";
//       cell1.setAttribute("class", "w3-text-blue w3-large");
//       var cell1 = row.insertCell(1);
//       cell1.innerHTML = "Revenue";
//       cell1.setAttribute("class", "w3-text-red w3-large");
//       var cell1 = row.insertCell(2);
//       cell1.innerHTML = "EBITDA";
//       cell1.setAttribute("class", "w3-text-blue w3-large");
//       var cell1 = row.insertCell(3);
//       cell1.innerHTML = "Income";
//       cell1.setAttribute("class", "w3-text-red w3-large");
//       Object.keys(obj).forEach(function (key) {
//         if (obj[key].revenue) {
//           if (a < 8) {
//             var row = table.insertRow(1);
//             var value = obj[key];
//             var cell1 = row.insertCell(0);
//             cell1.innerHTML = obj[key].date;
//             cell1.setAttribute("class", "w3-text-black w3-large");
//             var cell1 = row.insertCell(1);
//             cell1.innerHTML = obj[key].revenue;
//             cell1.setAttribute("class", "w3-text-black w3-large");
//             var cell1 = row.insertCell(2);
//             cell1.innerHTML = obj[key].ebitda;
//             cell1.setAttribute("class", "w3-text-black w3-large");
//             var cell1 = row.insertCell(3);
//             cell1.innerHTML = obj[key].netIncome;
//             cell1.setAttribute("class", "w3-text-black w3-large");
//             a++;
//           }
//         } else {
//           // If no financials response for a given stock, then hide the financials table from display
//           var x = document.getElementById("financialsTable");
//           x.style.display = "none";
//           // if no financials response for a given stock, then hide the financials option from the nav bar
//           var y = document.getElementById("financialDisp");
//           y.style.display = "none";
//         }
//       });
//     }
//   };
// }
