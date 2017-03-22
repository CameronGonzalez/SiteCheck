function getUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}
function getDomain(url) {
  var tmp=document.createElement('a');
  tmp.href = url;
  return tmp.hostname;
}
function renderSiteInfo(url){
  try{
    var searchUrl= "http://www.avgthreatlabs.com/ca-en/website-safety-reports/domain/"+getDomain(url);
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if(xhr.status==404){//we are on a page for which security checks are unavailable (i.e. new tab, history, untested url etc)
        document.getElementById('statusImg').src="check4.png";
        document.getElementById('status').textContent="Information Unavailable"; 
        document.getElementById('securityDetails').textContent="No further information to display.";    
      }
      else{//security checks are available
        var status = this.responseXML.getElementsByClassName('veredict middle')[0].children[1].innerHTML.trim();
        if(status=="Safe"){
          document.getElementById('statusImg').src="check1.png";
          document.getElementById('status').textContent="Safe";
        }
        else if(status=="Caution"){
          document.getElementById('statusImg').src="check2.png";
          document.getElementById('status').textContent="Possibly Un-safe";
        }
        else if(status=="Danger!"){
          document.getElementById('statusImg').src="check3.png";
          document.getElementById('status').textContent="Dangerous!";
        }
        else{//Untested
          document.getElementById('statusImg').src="check4.png";
          document.getElementById('status').textContent="Information Unavailable";
        }
        document.getElementById('loading').textContent="";
        document.getElementById('summary').textContent=this.responseXML.getElementsByClassName('site-reports-summar-text')[0].
                                                       children[0].innerHTML;
        document.getElementById('malware').textContent=(this.responseXML.getElementsByClassName('veredict')[1].children[0].
                                                        innerHTML.trim()+": "+this.responseXML.
                                                        getElementsByClassName('veredict')[1].children[1].innerHTML.trim());
        document.getElementById('compromised').textContent=(this.responseXML.getElementsByClassName('veredict last')[0].children[0].
                                                            innerHTML.trim()+": "+this.responseXML.
                                                            getElementsByClassName('veredict last')[0].children[1].textContent.trim());
        document.getElementById('lastUpdate').textContent=this.responseXML.getElementsByClassName('update')[0].innerHTML;
        //append security details
      }
    }
    xhr.open("GET", searchUrl);
    xhr.responseType = "document";
    xhr.send();
    document.getElementById('status').textContent="Loading...";
    document.getElementById('loading').textContent="Loading...";
  }
  catch(e){
    console.log("Error: "+ e);
    document.getElementById('statusImg').src="check4.png";
    document.getElementById('status').textContent="Information Unavailable"; 
    document.getElementById('securityDetails').textContent="No further information to display.";
  }
}
function details(){
  var acc = document.getElementsByClassName("accordion");
  for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } 
      else {
        panel.style.display = "block";
      }
    }
  }
}
document.addEventListener('DOMContentLoaded', function() {
  getUrl(function(url) { 
    details();
    renderSiteInfo(url);
  });
});
