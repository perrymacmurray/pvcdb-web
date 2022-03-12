function markBusy() {
    var element = document.getElementById("query_go");
    element.innerText = "";
    element.setAttribute("aria-busy", "true");
}

function unmarkBusy() {
    var element = document.getElementById("query_go");
    element.innerText = "Go";
    element.setAttribute("aria-busy", "false");
}

async function unmarkBusyWithError() {
	var element = document.getElementById("query_go");
	element.style.backgroundColor = "#a00000";
    element.innerText = "Failed";
    element.setAttribute("aria-busy", "false");
	await new Promise(resolve => setTimeout(resolve, 800));
	element.style.backgroundColor = "black";
    element.innerText = "Go";
}

async function doQuery() {
    var query = document.getElementById("query").value;
    if (query.length == 0 || document.getElementById("query_go").getAttribute("aria-busy") == "true") {
        return;
    }

    markBusy();
    fetch('https://pvcdb.xyz/api/search/' + query).then(async function(response) {
			if (!response.ok) {
				unmarkBusyWithError();
				throw Error(response.statusText);
				return;
			}
			  
			const info = await response.json(); //extract JSON from the http response
	
    		for(data of document.getElementsByClassName("out_Name")) {
        		data.innerText = info.Name;
    		}
    		for(data of document.getElementsByClassName("out_iupacName")) {
				data.innerText = info.iupacName;
			}
			for(data of document.getElementsByClassName("out_cid")) {
				data.innerText = info.cid;
			}
    		for(data of document.getElementsByClassName("out_molecularFormula")) {
        		data.innerText = info.molecularFormula;
    		}
    		for(data of document.getElementsByClassName("out_molecularWeight")) {
        		data.innerText = info.molecularWeight;
    		}
    		for(data of document.getElementsByClassName("out_id")) {
        		data.innerText = info.id;
    		}
		
			document.getElementById("out_image").setAttribute("src", "https://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=" + info.cid + "&width=200&height=200");
			document.getElementById("chem").removeAttribute("hidden");
		
    		unmarkBusy();									
		});
}