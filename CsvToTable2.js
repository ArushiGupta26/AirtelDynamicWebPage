

 (function(){
	console.log("Inside Immediately Invoked Function");
	this.CsvToTable = function(){
		console.log("Inside CsvToTable Constructor");
		this.csvFile = null;

    	if (arguments[0] && typeof arguments[0] === "object") {
      		this.options = arguments[0];
    	}

	}

	CsvToTable.prototype.run = function() {
		console.log('Inside Run function property added using the Object Prototype');
		return buildTable.call(this);
		
	}

	function getCSV() {
// 	request.response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
// request.response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
// request.response.setHeader("Expires", "0"); // Proxies.
		
		try{
			console.log("Inside getCSV");
			var csvfile = this.options.csvFile;
			// console.log(options);
			// console.log(csvfile);
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open("GET", csvfile, true);
				console.log(request);
				request.onload = function() {
				    if (request.status == 200) {
				        resolve(request.response);
				    } else {
				        reject(Error(request.statusText));
				    }
				};

				request.onerror = function() {
				 	reject(Error('Error fetching data.'));
				};
				request.send();
			});
		}catch(err){
			console.error(err);
			return Promise.reject(err);
			
		}
		
	}

    function isNotEmpty(row) {
        return row !== "";
    }
    if (!Array.prototype.filter) {
      Array.prototype.filter = function(f) {
        "use strict";
        var p = arguments[1];
        var o = Object(this);
        var len = o.length;
        for (var i = 0; i < len; i++) {
          if (i in o) {
              var v = o[i];
              f.call(p, v, i, o);
          }
        }

        return this;
      };
    }

	function searchuser(input)
	{
		console.log("Inside callback if 2")
				      console.log("back to searchuser");
                let x = document.getElementsByTagName('tr');
			for (i = 0; i < x.length; i++) {  
				// console.log(x[i].innerHTML);
				
				if (x[i].innerHTML.toLowerCase().includes(input)) { 
					x[i].style.display=""; 
				} 
				else { 
					x[i].style.display="none";                  
				} 
			} 
            console.log("searchuser end");
			if(document.getElementById('searchbar').value=="")
			{
				buildTable(1,0);
			}
	}

	function buildTable(currentPage,callback=0,input="") {
		console.log("Inside buildTable");
		var currentPage = pageupdate(currentPage);
	
	console.log("buildtable start 2");
 
		getCSV.call(this).then(function(response){
			
			var allRows = response.split(/\r?\n|\r/).filter(isNotEmpty);
			console.log("Debug: allRows", allRows);
	        var table = '<table>';
			if(allRows.length>10)
			pageSize=10;
		else
		{
			pageSize = allRows.length;
		}
		if(callback===1)
		{
			console.log("Inside callback if")
			pageSize=allRows.length;
		}
			

			console.log('inside getCSV call');
			// console.log(allRows);
    		var start = (currentPage - 1) * pageSize;
			var end;
			if(start+pageSize<allRows.length)
    		end = start + pageSize+1;
			else
			end = allRows.length
			var headerrow = allRows[0].split(',');
			
    		// var paginatedRows = allRows.slice(start, end);
	        for (var singleRow = start; singleRow < end; singleRow++) {
				console.log("inside buildTable for loop");
				table += '<thead>';
				table += '<tr>';  
				
	            if (singleRow === 0) {
	                table += '<thead>';
	                table += '<tr>';
	            } else {
	                table += '<tr>';
	            }
	            var rowCells = allRows[singleRow].split(',');
	            for(var rowCell = 0; rowCell < headerrow.length; rowCell++){
	                if(singleRow === start){
	                    table += '<th>';
	                    table += headerrow[rowCell];
	                    table += '</th>';
	                } else {
	                    table += '<td>';
						// console.log('Hello');

						if (typeof rowCells[rowCell] === 'undefined' || rowCells[rowCell] === null) {
							// console.log('Hello');
							table += '-';
						}
						else{
	                    table += rowCells[rowCell];
						}
	                    table += '</td>';
	                }
	            }
	            if (singleRow === 0) {
	                table += '</tr>';
	                table += '</thead>';
	                table += '<tbody>';
	            } else {
	                table += '</tr>';
	            }
	        }
	        table += '</tbody>';
	        table += '</table>';
			
			 document.getElementById("table-container").innerHTML = table;
			 var pageNumbersDiv = document.getElementById("pageNumbers");
			 var prevButton = document.getElementById("prevBtn");
			 var nextButton = document.getElementById("nextBtn");
			 pageNumbersDiv.innerHTML = '';
		
			 prevButton.addEventListener("click", function() {
				if(currentPage>1)
				{
					
					currentPage--;
					window.location.replace("#"+currentPage);
				pageupdate(currentPage);
				 buildTable(currentPage);
				 
				}
				 
			 });
			 nextButton.addEventListener("click", function() {
                console.log("Inside nextButton")
				if(currentPage<allRows.length/(pageSize))
				{
					currentPage++;
					window.location.replace("#"+currentPage);
					pageupdate(currentPage);
				 buildTable(currentPage);
				}
				 
			 });
			 var buttonend;
			 var totalPages = allRows.length/(pageSize);
			 if(totalPages-currentPage>=10)
			 {
				buttonend = 10;
			 }
			 else
			 {
				buttonend = totalPages-currentPage+1
			 }
			 for (var i = currentPage; i <currentPage+buttonend; i++) {
				console.log("Inside curr page for loop");
				// console.log(currentPage+buttonend);
				 var pageNumberButton = document.createElement("button");
				 pageNumberButton.innerText = i;
				 if(i==currentPage)
				 {
					pageNumberButton.style.backgroundColor = 'salmon';
				 }
				 pageNumberButton.addEventListener("click", function() {
					console.log("pagenumberbutton")
					 currentPage = parseInt(this.innerText);
					 window.location.replace("#"+currentPage);
					 pageupdate(currentPage);
					 buildTable(currentPage);
					 
				 });
	
				 pageNumbersDiv.appendChild(pageNumberButton);
			 }

			 if(callback===1)
			 {
				 searchuser(input);
			 }
					 
			
		},  
				function(error){
			console.error(error);
		});
	
	}



	CsvToTable.prototype.search = function(input) {
		console.log("Inside search in CsvToTable");
		// var nocallback = 1;
		buildTable(1,1,input);
		console.log("Inside search in CsvToTable 2");
		
		
	}
	
}());
