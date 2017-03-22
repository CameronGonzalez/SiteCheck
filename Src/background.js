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
function updateIcon(url){
  try{
    var searchUrl= "http://www.avgthreatlabs.com/ca-en/website-safety-reports/domain/"+getDomain(url);
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if(xhr.status==404){//we are on a page for which security checks are unavailable (i.e. new tab, history, untested url, etc)
        chrome.browserAction.setBadgeText({text: ""});
        chrome.browserAction.setIcon({path:"check4.png"}); 
      }
      else{//security checks are available
        var status = this.responseXML.getElementsByClassName('veredict middle')[0].children[1].innerHTML.trim();
        if(status=="Safe"){
	  chrome.browserAction.setBadgeText({text: ""});
          chrome.browserAction.setIcon({path:"check1.png"});
        }
        else if(status=="Caution"){
          chrome.browserAction.setBadgeText({text: ""});
          chrome.browserAction.setIcon({path:"check2.png"});
        }
        else if(status=="Danger!"){
          chrome.browserAction.setBadgeText({text: ""});
          chrome.browserAction.setIcon({path:"check3.png"});
        }
        else{//Untested
          chrome.browserAction.setBadgeText({text: ""});
          chrome.browserAction.setIcon({path:"check4.png"});
        }
      }
    }
    xhr.open("GET", searchUrl);
    xhr.responseType = "document";
    xhr.send();
    chrome.tabs.onActivated.addListener(function(){
      xhr.abort();
    });
    chrome.tabs.onUpdated.addListener(function(){
      xhr.abort();
    });
    chrome.tabs.onCreated.addListener(function(){
      xhr.abort();
    });
  }
  catch(e){
    console.log("Error: "+e);
    chrome.browserAction.setBadgeText({text: ""});
    chrome.browserAction.setIcon({path:"check4.png"});
  }
}
chrome.tabs.onActivated.addListener(function(){
  chrome.browserAction.setBadgeText({text: "..."});
  chrome.browserAction.setBadgeBackgroundColor({color: '#808080'});
  getUrl(function(url) {
    updateIcon(url);
  });
});
chrome.tabs.onUpdated.addListener(function(){
  chrome.browserAction.setBadgeText({text: "..."});
  chrome.browserAction.setBadgeBackgroundColor({color: '#808080'});
  getUrl(function(url) { 
    updateIcon(url);
  });
});
chrome.tabs.onCreated.addListener(function(){
  chrome.browserAction.setBadgeText({text: "..."});
  chrome.browserAction.setBadgeBackgroundColor({color: '#808080'});
  getUrl(function(url) { 
    updateIcon(url);
  });
});
