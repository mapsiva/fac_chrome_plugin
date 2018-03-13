//The MIT License
//
//Copyright (c) 2018 Athanasios Andreou, <andreou@eurecom.fr>
//
//Permission is hereby granted, free of charge, 
//to any person obtaining a copy of this software and 
//associated documentation files (the "Software"), to 
//deal in the Software without restriction, including 
//without limitation the rights to use, copy, modify, 
//merge, publish, distribute, sublicense, and/or sell 
//copies of the Software, and to permit persons to whom 
//the Software is furnished to do so, 
//subject to the following conditions:
//
//The above copyright notice and this permission notice 
//shall be included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
//IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
//ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
//SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var USER_ID_TAG = /"USER_ID":"[0-9][0-9]+"/;
var NUMBER_TAG = /[0-9]+/;

function getUserIdStr(elem) {
    var idTag = elem.match(USER_ID_TAG);
    if (!idTag) { 
        return null
    }
    return idTag[0].match(NUMBER_TAG)[0]
}

function getUserId() {
    return getUserIdStr(document.head.innerHTML)
}

var s = document.createElement("script");
s.src = chrome.extension.getURL("xhrOverloadPreferences.js");
(document.head||document.documentElement).appendChild(s);

String.prototype.nthIndexOf = function(pattern, n) {
    var i = -1;

    while (n-- && i++ < this.length) {
        i = this.indexOf(pattern, i);
        if (i < 0) break;
    }

    return i;
}

var ALL_CRAWLED = {'advertisers':false,'interests':false,'categories':false}

function getScriptWithData(txt) {
    var scripts = document.getElementsByTagName('script')
for (var i = 0; i < scripts.length; i++) {
  if (scripts[i].innerHTML.indexOf(txt)!=-1) {
    return scripts[i];
  }
}
    return -1
}


function parseList(txt,pos=1) {
    if (pos>txt.length) {
        return -1
    }
    try {
        return JSON.parse(txt.slice(0,pos))
    } catch (e) {
        return parseList(txt,pos+1)
        }
}



function getDem() {
    var txt = 'demographicStatus":'
    var script = getScriptWithData(txt);
    if (script ==-1 ) 
        {return -1}
    var pos = script.innerHTML.indexOf(txt);
    console.log(pos)
    return parseList(script.innerHTML.slice(pos+txt.length))
    
}


//function getBeh() {
//    var txt = 'behaviors":'
//    var script = getScriptWithData(txt);
//    if (script ==-1 ) 
//        {return -1}
//    var pos = script.innerHTML.nthIndexOf(txt,2);
//    console.log(pos)
//    return parseList(script.innerHTML.slice(pos+txt.length))
//    
//}


function getBeh() {
    var txt_0 ='behaviors":'
    var txt_1 = 'behaviors":[{"fbid'
    var txt_2 = 'demographicStatus":'
    var script = getScriptWithData(txt_2);
    if (script ==-1 ) 
        {return -1}
    var pos = script.innerHTML.nthIndexOf(txt_1,1);
    console.log(pos)
    return parseList(script.innerHTML.slice(pos+txt_0.length))
    
}



var count = 200
function getDemographicsAndBehaviors(){
    
    if (count<0) {
        var data = {user_id:getUserId(),demographics:-1,behaviors:-1};
        data['type'] = 'demBehaviors';
        data['timestamp'] = (new Date).getTime();
        data['raw'] = document.head.innerHTML+document.body.innerHTML;
        
        chrome.runtime.sendMessage(data)
        return
    }
    console.log('getting demographics')
    try {
    var demographics = getDem();
    var behaviors = getBeh();
    
    if ((demographics==-1) && (behaviors==-1) && (count>0)) {
        count--;
        window.setTimeout(getDemographicsAndBehaviors,1000)
        return
    }

    if ((demographics!=1) || (behaviors!=-1) ){
        var data = {user_id:getUserId(),demographics:demographics,behaviors:behaviors};
        data['type'] = 'demBehaviors';
        data['timestamp'] = (new Date).getTime();
        data['raw'] = document.head.innerHTML+document.body.innerHTML;
        
        chrome.runtime.sendMessage(data);

    }
    ALL_CRAWLED.categories=true;
    } catch (e) {
        console.log(e)
        
        count--;
        window.setTimeout(getDemographicsAndBehaviors,1000)
    }
}

getDemographicsAndBehaviors()



window.addEventListener("message", function(event) {
    // We only accept messages from ourselves

    if (event.source != window)
        return;

    if (event.data.type && (event.data.type=='advertisersData')){
        console.log("Content script received message: ");
        console.log(event.data)
        var data = event.data
        data['user_id'] =getUserId()
        data['timestamp'] = (new Date).getTime();

        chrome.runtime.sendMessage(data);
        ALL_CRAWLED.advertisers=true;
        }
    if (event.data.type && (event.data.type=='interestsData')){
        console.log("Content script received message: " );
        var data = event.data
        data['user_id'] =getUserId()
        data['timestamp'] = (new Date).getTime();

        chrome.runtime.sendMessage(data);        
        ALL_CRAWLED.interests=true

        }
    
    

})

;