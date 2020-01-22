// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
	// Get the Sidebar
	var mySidebar = document.getElementById("mySidebar");

	// Get the DIV with overlay effect
	var overlayBg = document.getElementById("myOverlay");
  	if (mySidebar.style.display === 'block') {
	    mySidebar.style.display = 'none';
	    overlayBg.style.display = "none";
	} else {
	    mySidebar.style.display = 'block';
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

//Used to retrieve stock information and On load function call it displays default stock ("BABA")  
function get_stock_info(stock)
{
	var myStock;
	if (stock === "VSI") // Run this for "View Stock Information"
	{
		myStock = document.getElementById('inputStock').value; // Store Input field value to variable for further processing

	} else // Run this for default stock options
	{
		myStock = stock;	
		document.getElementById('inputStock').value = ""; // Clear Input field when not in use
	}

	//Display selected stock next to Stock heading
	var heading=document.getElementById("stockName");
	heading.innerHTML =" Stock: "+myStock;

	//Display selected stock next to Dashboard heading
	var heading1=document.getElementById("dashboardStock");
	heading1.innerHTML =" Dashboard: "+myStock;

	//Default financials table view should be displayed to the user
	var x = document.getElementById("financials");
	x.style.display = "block";

	//Default financials view should be displayed in nav bar
	var y = document.getElementById("financialDisp");
	y.style.display = "block";

	//Retrieve MACD, RSI and Financials
	macdRsi(myStock);
	financials(myStock);

}

//Computes and Displays values into MACD, RSI, Deduction Tables
function macdRsi(myStock) 
{       
        //remove previous data from MACD table
        var Parent=document.getElementById("macdTable");
        while(Parent.hasChildNodes())
        {
           Parent.removeChild(Parent.firstChild);
        }
        //remove previous data from Deductions table
        var Parent=document.getElementById("deductionsTable");
        while(Parent.hasChildNodes())
        {
           Parent.removeChild(Parent.firstChild);
        }
        //remove previous data from RSI table
        var Parent=document.getElementById("rsiTable");
        while(Parent.hasChildNodes())
        {
           Parent.removeChild(Parent.firstChild);
        }
        //remove previous data from financials table
        for (x=0; x<6; x++)
        {
        	var Parent=document.getElementById("col1"+x);
        	while(Parent.hasChildNodes())
	        {
	           Parent.removeChild(Parent.firstChild);
	        }
	        var Parent=document.getElementById("col2"+x);
        	while(Parent.hasChildNodes())
	        {
	           Parent.removeChild(Parent.firstChild);
	        }
	        var Parent=document.getElementById("col3"+x);
        	while(Parent.hasChildNodes())
	        {
	           Parent.removeChild(Parent.firstChild);
	        }
        }

        var time = 12;//MACD Short Time
        var timeLng = 26;//MACD Long Time
        var sigLine = 9;//MACD Signal Line Time
        var timeRsi = 14;//RSI Time

     	//Construct API request
        req="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";
        req=req.concat(myStock,"&apikey=API_KEY&datatype=csv");
        
        var wsreq=new XMLHttpRequest();
        //Code to retrieve API Response
        wsreq.open("GET",req,true);
        wsreq.send();
        wsreq.onreadystatechange=function() 
        {	
        	//Once there is a response from the API
            if (this.readyState == 4 && this.status == 200) 
            {
                var RspCsv=wsreq.responseText;
                rows = RspCsv.split(/[\s]+/);

         		//Error handling in case of an invalid stock input
                if(RspCsv.search("Error Message")>=0)
                {
                	alert("Please enter a valid stock ticker");
                	get_stock_info("BABA");
                	return;
                }

                //Populate headings in first row of MACD table
                var tableref=document.getElementById("macdTable");
                newRow = tableref.insertRow(0);

                newCell0=newRow.insertCell(0);
                newCell0.innerHTML ="Date".italics();
                newCell0.className = "w3-text-blue w3-large";
                newCell0.id="date";
              
                newCell0=newRow.insertCell(1);
                newCell0.innerHTML ="Closing Price".italics();
                newCell0.className = "w3-text-red w3-large";
                newCell0.id="price";

                newCell0=newRow.insertCell(2);
                newCell0.innerHTML ="MACD".italics();
                newCell0.className = "w3-text-blue w3-large";
                newCell0.id="macdvalue";

                newCell0=newRow.insertCell(3);
                newCell0.innerHTML ="Indicator".italics();
                newCell0.className = "w3-text-red w3-large";
                newCell0.id="indicator";

                // Displaying Date and closing value
                for (i=1; i<6; i++)      
                {
                    b=rows[i].split(",");
                    //MACD Table
                    newRow = tableref.insertRow(i);
                    
                    newCell0=newRow.insertCell(0);
                    disp1=b[0];
                    newCell0.innerHTML =disp1;

                    newCell0=newRow.insertCell(1);
                    disp1=b[4];
                    newCell0.innerHTML =disp1;

                    newCell0=newRow.insertCell(2);
                    rowName="macd_" +i;
                    newCell0.id=rowName;

                    newCell0=newRow.insertCell(3);
                    rowName="indicator_" +i;
                    newCell0.id=rowName;

                };
               

                //Create Date MACD/RSI Indicator Header to Deductions Table
                var tableref2=document.getElementById("deductionsTable");
                newRow2 = tableref2.insertRow(0);

                newCell2=newRow2.insertCell(0);
                newCell2.innerHTML ="Date".italics();
                newCell2.className = "w3-text-blue w3-large";
                newCell2.id="date";
              
                newCell2=newRow2.insertCell(1);
                newCell2.innerHTML ="MACD Indicator".italics();
                newCell2.className = "w3-text-red w3-large";
                newCell2.id="macdIndicator";

                newCell2=newRow2.insertCell(2);
                newCell2.innerHTML ="RSI Value".italics();
                newCell2.className = "w3-text-blue w3-large";
                newCell2.id="rsiValue";

                // Displaying Date and closing value
                for (i=1; i<6; i++)      
                {
                    b=rows[i].split(",");

                    //Deductions Table
                    newRow2 = tableref2.insertRow(i);

                    newCell2=newRow2.insertCell(0);
                    disp1=b[0];
                    newCell2.innerHTML =disp1;

                    newCell2=newRow2.insertCell(1);
                    rowName="macdindicator_"+i;
                    newCell2.id=rowName;

                    newCell2=newRow2.insertCell(2);
                    rowName="rsivalue_"+i;
                    newCell2.id=rowName;

                };

                //Create Date and Volume Header to RSI Table
                var tableref3=document.getElementById("rsiTable");
				newRow3 = tableref3.insertRow(0);

				newCell3=newRow3.insertCell(0);
				newCell3.innerHTML ="Date".italics();
				newCell3.className = "w3-text-blue w3-large";
				newCell3.id="datersi";

				newCell3=newRow3.insertCell(1);
				newCell3.innerHTML ="Volume".italics();
				newCell3.className = "w3-text-red w3-large";
				newCell3.id="volumersi";

				newCell3=newRow3.insertCell(2);
				newCell3.innerHTML ="Average Gain".italics();
				newCell3.className = "w3-text-blue w3-large";
				newCell3.id="avggainrsi";

				newCell3=newRow3.insertCell(3);
				newCell3.innerHTML ="Average Loss".italics();
				newCell3.className = "w3-text-red w3-large";
				newCell3.id="avglossrsi";

				// Displaying Date and Volume value
                for (i=1; i<6; i++)      
                {
                    b=rows[i].split(",");

                    //Deductions Table
                    newRow3 = tableref3.insertRow(i);

                    newCell3=newRow3.insertCell(0);
                    disp1=b[0];
                    newCell3.innerHTML =disp1;

                    newCell3=newRow3.insertCell(1);
                    disp1=b[5];
                    newCell3.innerHTML =disp1;

                    newCell3=newRow3.insertCell(2);
                    rowName="avggain_"+i;
                    newCell3.id=rowName;
                  
                    newCell3=newRow3.insertCell(3);
                    rowName="avgloss_"+i;
                    newCell3.id=rowName;
                    
                };

                //Calculate Date and Closing value
                var arrClose = [];
                var arrDate=[];
                for (j=1; j<rows.length; j++)   
                {       
                    b = rows[j].split(",");
                    arrClose[j] = b[4];
                    arrDate[j]=b[0];
                };

                //Calculate change value for RSI
                var arrChange = [];
                for (j=1; j<rows.length-2; j++)  //length of Change array is 99 
                {   
                    ChangeActual = arrClose[j]-arrClose[j+1];
                    arrChange[j] = ChangeActual.toFixed(2);
                };

                //Calculate Avg Gain or Loss
		        dataptLastAvg=rows.length-2-timeRsi; // Should start from this value and go till "dataptLastAvg+timeRsi+1"
		        var arrAvggain=[];
		        var arrAvgloss=[];
		      	for (j=dataptLastAvg; j>0; j--)	
				{	
					Changesumgain=0;
					Changesumloss=0;

					if(j==dataptLastAvg)
					{
	    				for (i=j;i<j+timeRsi;i++)
	  					{	  							
							if (arrChange[i]>=0)
						 	{	
								Changesumgain=+Changesumgain+ +arrChange[i];
							}									
							else
							{
								ChangeAbs=(-1)*arrChange[i];
								Changesumloss=+Changesumloss+ +ChangeAbs;
							}                    					
	  					}
	  					AvggainActual=Changesumgain/timeRsi;
	  					arrAvggain[j]=AvggainActual.toFixed(2);
	  					AvglossActual=Changesumloss/timeRsi;
	  					arrAvgloss[j]=AvglossActual.toFixed(2);
  					}
  					else
  					{
  						weightAvgRsi=timeRsi-1;
  						if(arrChange[j]<0)
  						{ 						
	  						AvggainActual=(+weightAvgRsi*arrAvggain[j+1])/timeRsi;
	  						arrAvggain[j]=AvggainActual.toFixed(2);
							AvglossActual=(+weightAvgRsi*arrAvgloss[j+1]+ (-1*arrChange[j]))/timeRsi;
							arrAvgloss[j]=AvglossActual.toFixed(2);
						}
						else
						{
							AvggainActual=(+weightAvgRsi*arrAvggain[j+1]+ +arrChange[j])/timeRsi;
	  						arrAvggain[j]=AvggainActual.toFixed(2);
							AvglossActual=(+weightAvgRsi*arrAvgloss[j+1])/timeRsi;
							arrAvgloss[j]=AvglossActual.toFixed(2);
						}
  					}	
  				}

  				//Calculate RSI
		        dataptLastAvg=rows.length-2-timeRsi; 
		        var arrRSI=[];
		      	for (j=dataptLastAvg; j>0; j--)	
				{
					gainlossRatio=arrAvggain[j]/arrAvgloss[j];
					RsiActual=100-(100/(1+gainlossRatio));	
					arrRSI[j]=RsiActual.toFixed(2);
				};
  			
              	//Calculate EMA Short
                var arrEMAShrt = [];
                dataptLast=rows.length-time-1;
                for (j=dataptLast; j>0; j--)   
                {       
                    if (j==dataptLast)
                    {
                        var TempVal=0;
                        a=time-1; // time=12
                        for (i=dataptLast; i<=dataptLast+a; i++)
                        {
                            Close=arrClose[i];
                            TempVal=+Close + +TempVal; // Conversion to int
                        };
                        EMAShrtActual=TempVal/time;
                        arrEMAShrt[j]=EMAShrtActual.toFixed(2); // rounding to 2 decimal places
                    }
                    else
                    {                              
                        weightAvg=2/(+time + +1);
                        EMAShrtActual=arrClose[j]*weightAvg+arrEMAShrt[j+1]*(1-weightAvg);
                        arrEMAShrt[j]=EMAShrtActual.toFixed(2);
                               
                    };
                };

                //Calculate EMA Long
                var arrEMALong = [];
                dataptLastLng=rows.length-timeLng-1;
                for (j=dataptLastLng; j>0; j--)   
                {       
                    if (j==dataptLastLng)
                    {
                        var TempVal=0;
                        a=timeLng-1; // time=26
                        for (i=dataptLastLng; i<=dataptLastLng+a; i++)
                        {
                            Close=arrClose[i];
                            TempVal=+Close + +TempVal; // Conversion to int
                        };
                        EMALongActual=TempVal/timeLng;
                        arrEMALong[j]=EMALongActual.toFixed(2); // rounding to 2 decimal places
                    }
                    else
                    {                              
                        weightAvg=2/(+timeLng + +1);
                        EMALongActual=arrClose[j]*weightAvg+arrEMALong[j+1]*(1-weightAvg);
                        arrEMALong[j]=EMALongActual.toFixed(2);
                                   
                    }
                };

                //Calculate MACD
                var arrMacd=[];
                for (j=dataptLastLng; j>0; j--)        
                {       
                    EMAShrt=arrEMAShrt[j];
                    EMALng=arrEMALong[j]; 
                    macdActual=EMAShrt-EMALng;                      
                    arrMacd[j]=macdActual.toFixed(2);
                };   

                //Calculate Signal Line
                dataptLastSigLine=rows.length-timeLng-sigLine;
                var arrSigValue=[];
                for (j=dataptLastSigLine; j>0; j--)  
                {         
                    if (j==dataptLastSigLine)
                    {
                        var TempVal=0;
                        //number of data points 
                        a=sigLine-1;

                        //calculate avg for last n data pts.
                        for (i=dataptLastSigLine; i<=dataptLastSigLine+a; i++)
                        {      
                            TempVal=+arrMacd[i] + +TempVal;                
                        };

                        SigValueActual=TempVal/sigLine;
                        arrSigValue[j]=SigValueActual.toFixed(2);                                
                    }
                    else
                    {           
                        sigLineWeightAvg=2/(+sigLine + +1); //sigLine=9
                        SigValueActual=arrMacd[j]*sigLineWeightAvg+arrSigValue[j+1]*(1-sigLineWeightAvg);
                        arrSigValue[j]=SigValueActual.toFixed(2);
                    }
                };

                //Calculate Indicator Value
                var arrIndicator=[];
                for (j=dataptLastSigLine; j>0; j--)  
                {         
                    IndicatorValueActual=arrMacd[j] - arrSigValue[j];
                    arrIndicator[j]=IndicatorValueActual.toFixed(2);
                };

                /* Display Macd, Indicator in MACD Table
                   Buy/Sell in Deductions Table
                   Display Average gain and loss for RSI Table */
                var macIndicatorToday;
                for (i=1; i<6; i++)      
                {                	
                    newCell = document.getElementById("macd_"+i);
                    disp1= arrMacd[i];
                    newCell.innerHTML =disp1;

                    newCell = document.getElementById("rsivalue_"+i);
                    disp1= arrRSI[i];
	                newCell.innerHTML =disp1;
                    if (arrRSI[i] > 70){
	                    newCell.style.color="red";
                    }
                    else if (arrRSI[i] < 30){
                    	newCell.style.color="green";
                    }
                    
                    newCell = document.getElementById("indicator_"+i);
                    disp1= arrIndicator[i];
                    newCell.innerHTML =disp1;
                
                    newCell = document.getElementById("macdindicator_"+i);
                    if (arrIndicator[i] > 0.05)
                    {
                    	disp1= "BUY";
                    }
                    else if (-0.05 < arrIndicator[i] &  arrIndicator[i] < 0.05)
                    {
                    	disp1= "CLOSE TO REVERSAL";

                    }
                    else
                    {
                    	disp1= "SELL";
                    }
                    newCell.innerHTML =disp1; 

                    if (i==1)
                    {
                    	macIndicatorToday = disp1;
                    }

                    newCell = document.getElementById("avggain_"+i);
                    disp1= arrAvggain[i];
                    newCell.innerHTML =disp1;

                    newCell = document.getElementById("avgloss_"+i);
                    disp1= arrAvgloss[i];
                    newCell.innerHTML =disp1;

                };

                
                //Display MACD/Signal Line vs Date Graph
                var chart = c3.generate({
					bindto: '#chart',
					data: { 
						xs: {
				            'MACD': 'date',
				            'Signal Line': 'date',
				        },
					    columns: [
					    	['date', arrDate[1], arrDate[2], arrDate[3], arrDate[4], arrDate[5]],
					        ['MACD', arrMacd[1], arrMacd[2], arrMacd[3], arrMacd[4], arrMacd[5]],
					        ['Signal Line', arrSigValue[1], arrSigValue[2], arrSigValue[3], arrSigValue[4], arrSigValue[5]]
					    ],
						type: 'spline'
					},

					axis: {
						y: {
							tick: {
								format: d3.format('.2f')
							}
						},

						x: {
							type: 'timeseries',
					        tick: {
					            format: '%d-%m',
					            fit: true
							},
						}
					},

					padding: { 
						right: 20,
						left: 40
					}
				});

                //Display Closing Value vs Date graph
				var chart = c3.generate({
					bindto: '#chart2',
					data: { 
						xs: {
				            'Closing Value': 'date',
				        },
					    columns: [
					    	['date', arrDate[1], arrDate[2], arrDate[3], arrDate[4], arrDate[5]],
					        ['Closing Value', arrClose[1], arrClose[2], arrClose[3], arrClose[4], arrClose[5]],
					    ],
						type: 'spline',
						colors: {
							'Closing Value': '#ff0000',
						},
					},

					axis: {
						y: {
							tick: {
								format: d3.format('.2f')
							}
						},

						x: {
							type: 'timeseries',
					        tick: {
					            format: '%d-%m',
					            fit: true
							},
						}
					},

					padding: { 
						right: 20,
						left: 40
					}
				});

				//Send Stock data via mail 
				to = "surya242459@gmail.com",
				subject = "<"+myStock +"> "+ arrDate[1],
				body = "Enter the number of shares purchased/ sold below for future reference "+ "%0D%0A%0D%0AMACD: "+ 
						arrMacd[1]+"%0D%0ARSI: "+ arrRSI[1]+ "%0D%0AMACD Indicator: "+ macIndicatorToday + "%0D%0APurchased:" + 
						"%0D%0ASold:"+ "%0D%0A%0D%0ANote- If RSI > 70 : Over Bought, If RSI < 30 : Over Sold" + "%0D%0A",
				mailInfo = document.getElementById('mailInfo'),

				message = 'mailto:'+to
				subject||body?message+='?':false
				subject?message+='subject='+subject:false
				subject&&body?message+='&body='+body:false
				!subject&&body?message+='body='+body:false

				mailInfo.href = message
            }; 
        }; 
        
    }

//Populate financials table for selected stocks
function financials(myStock) 
{

	var comp=myStock;
	var req="https://financialmodelingprep.com/api/financials/income-statement/";
	req=req.concat(comp,"?datatype=json");
	var wsreq=new XMLHttpRequest();
	wsreq.open("GET",req,true);
	wsreq.send();
	wsreq.onreadystatechange=function()
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			var RspCsv=wsreq.responseText; //API Response as String                                                 
			var obj=JSON.parse(RspCsv);//Parse API Response as JSON


			//Loop through each key of the JSON value
			Object.keys(obj).forEach(function(key)	
			{       
				//alert(obj[key].Revenue);
				if(obj[key].Revenue)
				{
					var value = obj[key];
					var j=0;
					//loop through each value of the json key
					Object.getOwnPropertyNames(value.Revenue).forEach
					(function (val, idx, array) {
					var dat=val + " : " + value.Revenue[val];
					document.getElementById("col1"+j).innerHTML=dat;//populate columns col10, col11, col12, col13, col14, and col15
					j++;
					})
					
					var z=0;
					Object.getOwnPropertyNames(value.EBITDA).forEach
					(function (val, idx, array) {
					var dat=val + " : " + value.EBITDA[val];
					document.getElementById("col2"+z).innerHTML=dat;
					z++;
					})

					var f=0;
					Object.getOwnPropertyNames(value["Net income"]).forEach
					(function (val, idx, array) {
					var dat=val + " : " + value["Net income"][val];
					document.getElementById("col3"+f).innerHTML=dat;
					f++;
					})
				}
				else
				{	// If no financials response for a given stock, then hide the financials table from display
					var x = document.getElementById("financials");
					x.style.display = "none";
					// if no financials response for a given stock, then hide the financials option from the nav bar
					var y = document.getElementById("financialDisp");
					y.style.display = "none";
			        
				}
			});

		}
	}

}


 






