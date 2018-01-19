var url = "https://www.facebook.com/ads/preferences/dialog/?id=*";

var url_2 = "https://www.facebook.com/ajax/a.php?dpr=*";

var NEXT_ID = 0;

var BUTTONS = {};


var FLAG = {};


var WAIT_BETWEEN_REQUESTS = 360000;
var MSG_TYPE = 'message_type';
var FRONTADINFO = 'front_ad_info';
var SIDEADINFO = 'side_ad_info';
var TYPE = 'type'
var TYPES = {"frontAd" : "frontAd", "sideAd" : "sideAd","interests":"interestsData","advertisers":"advertisersData",demographics:'demBehaviors'};


//var HOST_SERVER = 'http://127.0.0.1:8000/facebook-ad-collector/';
//var HOST_SERVER = 'http://facebook-ad-collector.app-ns.mpi-sws.org/';
var HOST_SERVER = 'http://adanalyst.mpi-sws.org/';


var URLS_SERVER = {
    'registerAd' : HOST_SERVER+'register_ad',
    'registerExplanation': HOST_SERVER + 'register_explanation',
    'registerDemBeh': HOST_SERVER+'register_dem_beh',
    'registerInterests':HOST_SERVER+'register_interests',
    'registerAdvertisers':HOST_SERVER+'register_advertisers',
    'registerConsent':HOST_SERVER+'register_consent',
    'getConsent':HOST_SERVER +  'get_consent',
    'registerEmail': HOST_SERVER +  'register_email'

    
};
var PREFERENCES_URL = 'https://www.facebook.com/ads/preferences/'

//var REQUEST_TYPE = 'GET';
var REQUEST_TYPE = 'POST';

var STATUS = 'status';
var FAILURE = 'failure';
var ADID = 'adId';
var FBID = 'fb_id';
var MEDIA_REQUESTS = {};
var MEDIA_REQUEST_ID = 0;
var IMAGES = 'images';
var ADV_PROF_PIC = 'advertiser_facebook_profile_pic';
var MEDIA_CONTENT_FAILURE = 'MEDIA CONTENT NOT CAPTURED'
var MEDIA_CONTENT = 'media_content'
var CURRENT_USER_ID = -1;
var CURRENT_EMAIL = '';

var DAY_MILISECONDS =  8.64e+7;
var FACEBOOK_PAGE = 'http://www.facebook.com'
var ACCOUNT_SETTINGS = 'http://www.facebook.com/settings'
var HEAD_PATTERN = /<head>[\S\s]*<\/head>/
var FIFTEENMINUTES = 90000;
var ONEMINUTE = 60000 
var WAIT_FOR_TWO_HOURS = false;
var TWO_HOURS = FIFTEENMINUTES* 8;

var ABOUT_THIS_FACEBOOK_AD =['About This Facebook Ad','propos de cette pub Facebook'];
var MANAGE_YOUR_AD_PREFERENCES =['Manage Your Ad Preferences','G\u00e9rer vos pr\u00e9f\u00e9rences'];
var RATE_LIMIT_MSG = ['It looks like you were misusing this feature by going too fast','correctement en allant trop vite'];


//var INTERESTSCRAWL  = localhost.interestsCrawl?localhost.interestsCrawl:0;
//var ADVERTISERSCRAWL =localhost.advertisersCrawl?localhost.interestsCrawl:0;
//var DEMOGRAPHICSCRAWL =localhost.interestsCrawl?localhost.interestsCrawl:0;


var COLLECT_PREFERENCES_TAG = false;

var EXPLANATION_REQUESTS = {};

var PROBLEMATIC_EXPLANATIONS = [];


function getExplanationRequests() {
if (!localStorage.explanationRequests) {
        localStorage.explanationRequests = JSON.stringify({})
    }
    
    return JSON.parse(localStorage.explanationRequests);}
EXPLANATION_REQUESTS= getExplanationRequests();

function getCurrentUserId() {
    $.get({
        url:FACEBOOK_PAGE,
        success: function(resp) {
            try {
                var h = resp.match(HEAD_PATTERN);
                if (h.length <1) {
                    return
                }
                var head = h[0]
                var userId = getUserIdStr(head);
                if ((userId)&& (userId!=-1)) {
                    if ((userId!=CURRENT_USER_ID) || (CURRENT_EMAIL==='')) {
                        CURRENT_USER_ID = userId;
                        getCurrentUserEmail();
                    }
                    CURRENT_USER_ID = userId;

                }
            } catch (e) {
                console.log('catched!')
                console.log(e)
            }
        }
    })
    
    window.setTimeout(getCurrentUserId,FIFTEENMINUTES/8)

}

function getCurrentUserEmail() {
    $.get({
        url:ACCOUNT_SETTINGS,
        success: function(resp) {
            try {
                A= resp;
                var parser = new DOMParser();
                var doc = parser.parseFromString(resp,'text/html');
                var links = doc.getElementsByTagName('a');
                var link = ''
                for (let i=0;i<links.length;i++) {
                    if (links[i].getAttribute('href')==='/settings?tab=account&section=email') {
                        link = links[i];
                    }
                }
                var email = link.getElementsByTagName('strong')[0].textContent;
                CURRENT_EMAIL = email;
                var dat = {user_id:CURRENT_USER_ID,email:CURRENT_EMAIL};
            $.ajax({
              type: REQUEST_TYPE,
              url: URLS_SERVER.registerEmail,
              dataType: "json",
             traditional:true,
              data: JSON.stringify(dat),
              success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                      console.log('Failure to register email');
                      console.log(a)
                      window.setTimeout(getCurrentUserEmail,FIFTEENMINUTES)
                return true};
                
                  console.log('Success registering email');

                  
               },
            }).fail(function(a){
              console.log('Failure to register email');
              window.setTimeout(getCurrentUserEmail,FIFTEENMINUTES)


            }
                   );
                
//                var h = resp.match(HEAD_PATTERN);
//                if (h.length <1) {
//                    return
//                }
//                var head = h[0]
//                var userId = getUserIdStr(head);
//                if ((userId)&& (userId!=-1)) {
//                    CURRENT_USER_ID = userId;
//                }
            } catch (e) {
                console.log('Exception in getting email')
                console.log(e)
                
            }
        }
    })
    


}

getCurrentUserEmail()





getCurrentUserId();

function isCrawledOrQueue(adId,fbId) {
     if (!CRAWLED_EXPLANATIONS[fbId]) {
        CRAWLED_EXPLANATIONS[fbId]={};
    }
    
    if (!EXPLANATIONS_QUEUE[fbId]) {
        EXPLANATIONS_QUEUE[fbId] = {}
    }
    return ((adId.toString() in CRAWLED_EXPLANATIONS[fbId]) || (adId.toString() in EXPLANATIONS_QUEUE[fbId]))
}


function getCrawledExplanations() {
    if (!localStorage.crawledExplanations) {
        localStorage.crawledExplanations = JSON.stringify({})
    }
    
    return JSON.parse(localStorage.crawledExplanations);
    
}


function getExplanationsQueue() {
    if (!localStorage.explanationsQueue) {
        localStorage.explanationsQueue = JSON.stringify({})
    }
    
    return JSON.parse(localStorage.explanationsQueue);
    
}

var CRAWLED_EXPLANATIONS = getCrawledExplanations();
var EXPLANATIONS_QUEUE = getExplanationsQueue();


var NUM_WINDOWS = 0 ;
chrome.windows.getAll( null, function( windows ){
    NUM_WINDOWS = windows.length;
    console.log('Window Created + '+ NUM_WINDOWS)
});
chrome.windows.onCreated.addListener(function(windows){
    NUM_WINDOWS++;
    console.log("Window created event caught. Open windows #: " + NUM_WINDOWS);
});
chrome.windows.onRemoved.addListener(function(windows){

    NUM_WINDOWS--;
    
    console.log("Window removed event caught. Open windows #: " + NUM_WINDOWS);
    if( NUM_WINDOWS <= 0 ) {
        localStorage.crawledExplanations = JSON.stringify(CRAWLED_EXPLANATIONS);
        localStorage.explanationsQueue = JSON.stringify(EXPLANATIONS_QUEUE);
        localStorage.explanationRequests = JSON.stringify(EXPLANATION_REQUESTS);

        
    }
        
});



function addToCrawledExplanations(fbId,adId) {

    if (!CRAWLED_EXPLANATIONS[fbId]) {
        CRAWLED_EXPLANATIONS[fbId]={};
    }
    
    if (!EXPLANATIONS_QUEUE[fbId]) {
        EXPLANATIONS_QUEUE[fbId] = {}
    }
    
    
    let crawledIds = Object.keys(CRAWLED_EXPLANATIONS[fbId]);
    
    let ts = (new Date()).getTime();
    
    for (let i =0;i<crawledIds.length;i++) {
        if (ts - CRAWLED_EXPLANATIONS[fbId][crawledIds[i]] > (DAY_MILISECONDS * 3)) {
            try {
             delete CRAWLED_EXPLANATIONS[fbId][crawledIds[i]];
            } catch (e) {
                console.log("EXCEPTION IN addToCrawledExplanations");
                console.log(e)
            }        
        }
        }

    CRAWLED_EXPLANATIONS[fbId][adId] = ts;
    return true;
}

function addToQueueExplanations(fbId,adId,explanationUrl,dbRecordId) {
    console.log('ADDING to queue')
    
   if (!CRAWLED_EXPLANATIONS[fbId]) {
        CRAWLED_EXPLANATIONS[fbId]={};
    }
    
    if (!EXPLANATIONS_QUEUE[fbId]) {
        EXPLANATIONS_QUEUE[fbId] = {}
    }
    
    let queuedIds = Object.keys(EXPLANATIONS_QUEUE[fbId]);
    let ts = (new Date()).getTime();
    
    for (let i =0;i<queuedIds.length;i++) {
        if (ts - EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] > DAY_MILISECONDS) {
            try {
             delete EXPLANATIONS_QUEUE[fbId][queuedIds[i]];
            } catch (e) {
                console.log("EXCEPTION IN addToQueueExplanations");
                console.log(e)
            }
        }
    }
    
    queuedIds = Object.keys(EXPLANATIONS_QUEUE[fbId]);
    let crawledIds = Object.keys(CRAWLED_EXPLANATIONS[fbId]);
    
    
    if ((adId in queuedIds) || (adId in crawledIds)) {
        console.log('In here');
        return false
    } 
    
    console.log('Time here is ',ts);
    
    EXPLANATIONS_QUEUE[fbId][adId] = {timestamp:ts,explanationUrl:explanationUrl,dbRecordId:dbRecordId}
    return true
    
}


function getNextExplanation(fbId) {
    let queuedIds = Object.keys(EXPLANATIONS_QUEUE[fbId]);
    let ts = (new Date()).getTime();
    let oldestId = {adId:-1,'timestamp':0};
    
    for (let i =0;i<queuedIds.length;i++) {
        console.log(queuedIds[i]);
        console.log(EXPLANATIONS_QUEUE[fbId][queuedIds[i]])
        if (ts - EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] > DAY_MILISECONDS) {
            try {
                console.log('DELETING explanation',ts,EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'],DAY_MILISECONDS)
//             delete EXPLANATIONS_QUEUE[fbId][queuedIds[i]];
                continue;
            } catch (e) {
                console.log("EXCEPTION IN getExplanation");
                console.log(e)
            }
        }
        console.log(queuedIds[i]);
        console.log(EXPLANATIONS_QUEUE[fbId][queuedIds[i]])
        
        if ((ts - EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] <= DAY_MILISECONDS) && (EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'] >= oldestId['timestamp'])){
            oldestId.adId = queuedIds[i];
            oldestId.timestamp = EXPLANATIONS_QUEUE[fbId][queuedIds[i]]['timestamp'];
            
            
            
        }
    }
    
    try {
        let obj = EXPLANATIONS_QUEUE[fbId][oldestId.adId];
        if (oldestId.adId==-1) {
            return -1
        }
        console.log('Oldest obj is '+oldestId.adId)
        delete EXPLANATIONS_QUEUE[fbId][oldestId.adId];
        return [oldestId.adId,obj.explanationUrl,obj.dbRecordId,obj.timestamp];
    } catch(e) {
            console.log("EXCEPTION IN getNextExplanation returning");
                console.log(e)
                return -1;
            }
    
        
    
    
    
}
function exploreQueue() {
    console.log('Check for explanations');
    if ((EXPLANATIONS_QUEUE) && (CURRENT_USER_ID in EXPLANATIONS_QUEUE)) {
        try {
        cleanRequestLog(CURRENT_USER_ID)
        var ts =  (new Date()).getTime()
        var maxTs = Math.max.apply(null, EXPLANATION_REQUESTS[CURRENT_USER_ID])
        
        if ((WAIT_FOR_TWO_HOURS) &&(ts-maxTs < TWO_HOURS)) {
            console.log('Cannot make request (rate limited). Need to wait for ' + (WAIT_BETWEEN_REQUESTS - (ts-maxTs))/60000 + ' minutes');
            window.setTimeout(exploreQueue,WAIT_BETWEEN_REQUESTS);
            return
        }
            
         if ((WAIT_FOR_TWO_HOURS) &&(ts-maxTs >= TWO_HOURS)) {
            WAIT_FOR_TWO_HOURS=false;
         window.setTimeout(exploreQueue,WAIT_BETWEEN_REQUESTS/6);

            return
        }
            
        if (ts-maxTs < WAIT_BETWEEN_REQUESTS) {
            console.log('Cannot make request. Need to wait for ' + (WAIT_BETWEEN_REQUESTS - (ts-maxTs))/60000 + ' minutes');
            window.setTimeout(exploreQueue,WAIT_BETWEEN_REQUESTS  - (ts-maxTs));
            return
        }
            
        
        let params = getNextExplanation(CURRENT_USER_ID);
        if (params!=-1) {
            console.log('Getting explanations for '+ params[0]);

        
            getExplanationsManually(params[0],params[1],params[2],params[3])}
       
            
        }
         catch (err) {
            console.log(err);
        }
        
    }
    
    
    window.setTimeout(exploreQueue,WAIT_BETWEEN_REQUESTS/6);
}


exploreQueue();

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



function getBase64FromImageUrl(url,req_id,request,sendResponse,count=3) {
    
    console.log('For ',request.fb_id,' ', count);

    if (count<=0) {
//        FLAG FINISHED
        MEDIA_REQUESTS[req_id][url] = MEDIA_CONTENT_FAILURE;
        return true
    }

    
    try {
    var img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width =this.width;
        canvas.height =this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");
//        console.log(dataURL)
//        console.log(MEDIA_REQUESTS)
        MEDIA_REQUESTS[req_id][url] = dataURL
        console.log('For ',request.fb_id,' ', mediaRequestsDone(req_id));
        if (mediaRequestsDone(req_id)){
            request[MEDIA_CONTENT] = MEDIA_REQUESTS[req_id];
              delete MEDIA_REQUESTS[req_id];
            console.log('Sending request for frontAd');
            console.log(Object.keys(request))
            
            
            
            
        console.log('ALL ready to send ');
        console.log(request)
//        console.log(JSON.stringify(request))
        
         $.ajax({
              type: REQUEST_TYPE,
              url: URLS_SERVER.registerAd,
//              dataType: "json",
//             traditional:true,
             contentType: "application/json",
              data: JSON.stringify(request),
              success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                      console.log('Failure');
                      console.log(a)
                      sendResponse({"saved":false});
                return true};
                

                      
                  
                  console.log('Success');
                  let resp = {saved:true,dbId:a[ADID]}
//                  console.log(a[MSG_TYPE])
//                  console.log(a[FBID])
                  console.log(isCrawledOrQueue(a[FBID],CURRENT_USER_ID));
                  console.log(a[FBID])
//                  if ((a[TYPE] === TYPES.sideAd) && ((a[FBID] != -1)) && !isCrawledOrQueue(a[FBID],CURRENT_USER_ID) )  {
                    if ((a[FBID] != -1) && !isCrawledOrQueue(a[FBID],CURRENT_USER_ID) )  {

//                      resp.click=true
//                      FLAG[a[FBID]] = a[ADID]
                      console.log('Adding to explanations queue...')
                      addToQueueExplanations(CURRENT_USER_ID,request.fb_id,request.explanationUrl,a[ADID]);

                  }
                  
                  sendResponse(resp);},
            }).fail(function(a){
              console.log('Failure');
              console.log(a)
              sendResponse({"saved":false});});
              }
         
        
//        alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };

    img.src = url;
        
        
//FLAG FINSHED    
    }
    catch (e) {
        console.log("Couldn't grab "+ url);
        console.log(e);
        console.log("Trying again...");
        getBase64FromImageUrl(url,req_id,request,sendResponse,count-1);
        
        
        
    }
        return true

    }



function sendExplanationDB(adId,dbRecordId,explanation,count=10) {
                $.ajax({
              type: REQUEST_TYPE,
              url: URLS_SERVER.registerExplanation,
              data: {dbRecordId:dbRecordId,explanation:explanation},
              success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                    sendExplanationDB(adId,dbRecordId,explanation,--count)
                return true};
                

                      
                  console.log((new Date));
                  console.log('Success saving explanation');
                  addToCrawledExplanations(CURRENT_USER_ID,adId)

                  },
            }).fail(function(a){
              console.log('Failure in saving explanation');
              console.log(a)
              sendExplanationDB(adId,dbRecordId,explanation,--count)
              return true

         
});}

function getIndexFromList(txt,lst) {
    var idx = -1;
    for (let i=0;i<lst.length;i++) {
        idx = txt.indexOf(lst[i]);
        if (idx>=0) {
            console.log(idx)
            return idx;
        }
    }
    return -1
    
}

function getExplanationsManually(adId,explanationUrl,dbRecordId,timestamp) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",explanationUrl, true);
     xmlhttp.onload = function (e) {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            var response = xmlhttp.responseText;
            var expStart = getIndexFromList(response,ABOUT_THIS_FACEBOOK_AD);
            var expEnd = getIndexFromList(response,MANAGE_YOUR_AD_PREFERENCES);
          
            if (getIndexFromList(response,RATE_LIMIT_MSG)!=-1){
                console.log('Problem with parsing ' + url);
                console.log('RATE LIMITED')
                
                console.log((new Date));
                WAIT_FOR_TWO_HOURS=true;
                console.log(response);
                EXPLANATIONS_QUEUE[CURRENT_USER_ID][adId] =
                    {adId:adId,explanationUrl:explanationUrl,dbRecordId:dbRecordId,timestamp:timestamp}
                return 
            }
            
            
//            var explanation = response.slice(expStart,expEnd);
            console.log(expStart);
            console.log(expEnd);
           if ((expStart===-1) || (expEnd===-1)) {
                console.log('Something else is wrong with this explanation! Check it out!')
                console.log(response)
                PROBLEMATIC_EXPLANATIONS.push(response);
            }
            
            sendExplanationDB(adId,dbRecordId,response);
                
            
        }}
     
     xmlhttp.send(null);
            
    
}




function cleanRequestLog(fbId) {
  if (!(CURRENT_USER_ID in EXPLANATION_REQUESTS)) {
                EXPLANATION_REQUESTS[fbId] = [];
            }    
    var ts = (new Date()).getTime()
    var filteredLst = [] 
        for (let i=0;i<EXPLANATION_REQUESTS[fbId].length;i++) {
            if (ts - EXPLANATION_REQUESTS[fbId][i] <= DAY_MILISECONDS)  {
                filteredLst.push(EXPLANATION_REQUESTS[fbId][i])
            }
        }
    
    EXPLANATION_REQUESTS[fbId] = filteredLst;
    return
}


//https://www.facebook.com/feed/options_menu/?button_id=u_ps_0_0_c&feed_context=%7B%22disable_tracking%22%3Atrue%2C%22fbfeed_context%2




//https://www.facebook.com/ads/preferences/dialog/?ad_id=6066215713784&optout…mnBCwNoy9Dx6WK&__af=iw&__req=d&__be=-1&__pc=PHASED%3ADEFAULT&__rev=2872472
chrome.webRequest.onBeforeRequest.addListener(
        function (details) {      
            console.log('aladsad')
//            console.log(details.url);
            
            
//            if (details.url.indexOf('')) {
//                //BUTTON request
//                //check if belongs to an ad
//                //if it belongs send it to collect images
//                
//                var ad = getAdFromButton()
//                
//                
//                
//                
//            }
            console.log(details)
            if (details.url.indexOf('ads/preferences/dialog/?id')==-1) {
                console.log('LALALALALA')
                console.log(details.url)
                console.log('not an explanation request...');
                return {cancel:false}
            }
            
           
//            var adId = getParameterByName(AD_ID,details.url).toString();
//            console.log(adId)
////            console.log(details)
//            console.log(Object.keys(FLAG))
//            console.log(adId in FLAG)
//            if (( adId in FLAG) ) {
//                console.log('cancelling request')
//                let dbRecordId = FLAG[adId]
//                delete FLAG[adId];
//                addToQueueExplanations(CURRENT_USER_ID,adId,details.url,dbRecordId)
//                return   {cancel: true};
//            }
//            
          
            
            cleanRequestLog(CURRENT_USER_ID)
            var ts =  (new Date()).getTime()
            var maxTs = Math.max.apply(null, EXPLANATION_REQUESTS[CURRENT_USER_ID])
            
            if ((WAIT_FOR_TWO_HOURS) && (ts-maxTs < TWO_HOURS)) {
                console.log('Cannot make request. Need to wait for ' + (TWO_HOURS - (ts-maxTs))/60000 + 'minutes (rate limited)');
                return   {cancel: true};
            }
            
            if ((WAIT_FOR_TWO_HOURS) && (ts-maxTs >= TWO_HOURS)) {
                console.log('time to break the limit');
                WAIT_FOR_TWO_HOURS = false;
            }
            
            if (ts-maxTs < WAIT_BETWEEN_REQUESTS) {
                console.log('Cannot make request. Need to wait for ' + (WAIT_BETWEEN_REQUESTS - (ts-maxTs))/60000 + 'minutes');
                return   {cancel: true};
            }
            
            console.log('Pushiiig')
            EXPLANATION_REQUESTS[CURRENT_USER_ID].push((new Date()).getTime())
            return   {cancel: false};
            
            
            
        
            
//            return   {cancel: true};
        },
        { urls: [url]},["blocking"]
    );

//chrome.webRequest.onBeforeRequest.addListener(
//        function (details) {      
//            console.log(details.url);
//            return   {cancel: true};
//        },
//        { urls: [url_2]},["blocking"]
//    );

var ADSPACE = 'adSpace';
var PREFERENCESCRAWLED = {advertisers:false,interests:false,demBeh:false}
var PREFERENCESTAB = -1
var CRAWLINGPREFERENCES = false


function getPreferences() {
    alert ('It is time for the daily crawl in preferences! A new tab will open, and when the crawling finishes, it will close automaticaly. Thank you very much!');
    CRAWLINGPREFERENCES=true;
    chrome.tabs.create({ url: PREFERENCES_URL },function(a){
        console.log('new tab');
        PREFERENCESTAB = a['id'] 
        
    });
    
}


String.prototype.nthIndexOf = function(pattern, n) {
    var i = -1;

    while (n-- && i++ < this.length) {
        i = this.indexOf(pattern, i);
        if (i < 0) break;
    }

    return i;
}


function getScriptWithData(doc,txt) {
    var scripts = doc.getElementsByTagName('script')
for (var i = 0; i < scripts.length; i++) {
  if (scripts[i].innerHTML.indexOf(txt)!=-1) {
    return scripts[i];
  }
}
    return -1
}

function getAllScripstWithData(doc,txt) {
    var scripts = doc.getElementsByTagName('script')
    var all_scripts = [];
for (var i = 0; i < scripts.length; i++) {
  if (scripts[i].innerHTML.indexOf(txt)!=-1) {
    all_scripts.push(scripts[i]) ;
  }
}
    return all_scripts
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

function getDem(doc) {
    var txt = 'demographicStatus":'
    var script = getScriptWithData(doc,txt);
    if (script ==-1 ) 
        {return -1}
    var pos = script.innerHTML.indexOf(txt);
    console.log(pos)
    return parseList(script.innerHTML.slice(pos+txt.length))
    
}


function getBeh(doc) {
    var txt_0 ='behaviors":'
    var txt_1 = 'behaviors":[{"fbid'
    var txt_2 = 'demographicStatus":'
    var script = getScriptWithData(doc,txt_2);
    if (script ==-1 ) 
        {return -1}
    var pos = script.innerHTML.nthIndexOf(txt_1,1);
    console.log(pos)
    return parseList(script.innerHTML.slice(pos+txt_0.length))
    
}


//var count = 200
function getDemographicsAndBehaviors(count){
    
    
    $.get(PREFERENCES_URL,function(resp) {
       try {

        
			var parser = new DOMParser();
  			var htmlDoc = parser.parseFromString(resp,"text/html");
			console.log(htmlDoc);
            
                if (count<0) {
        var data = {user_id:CURRENT_USER_ID,demographics:-1,behaviors:-1};
        data['type'] = 'demBehaviors';
        data['timestamp'] = (new Date).getTime();
        data['raw'] = resp;
        console.log(data)
        
//        chrome.runtime.sendMessage(data)
        return
            }
            
                console.log('getting demographics')
 
    var demographics = getDem(htmlDoc);
    var behaviors = getBeh(htmlDoc);
    
    if ((demographics==-1) && (behaviors==-1) && (count>0)) {
        count--;
        
        getDemographicsAndBehaviors(count)
//        window.setTimeout(getDemographicsAndBehaviors,1000)
        return
    }
        
            if ((demographics!=1) || (behaviors!=-1) ){
        var data = {user_id:CURRENT_USER_ID,demographics:demographics,behaviors:behaviors};
        data['type'] = 'demBehaviors';
        data['timestamp'] = (new Date).getTime();
        data['raw'] = document.head.innerHTML+document.body.innerHTML;
            console.log(data)
              if ((localStorage.collectPrefs!=='true') || (localStorage[CURRENT_USER_ID+'consent']!=='true')) {
            return
        }
                
                         $.ajax({
              type: REQUEST_TYPE,
              url: URLS_SERVER.registerDemBeh,
              dataType: "json",
             traditional:true,
              data: JSON.stringify(data),
                tryCount : 0,
                retryLimit : 3,
              success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                    this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
                    }
                    console.log('Stoping trying...');

                return true};
               localStorage.lastBehaviorCrawl = (new Date()).getTime();

//          sendFrontAd(request,sendResponse);
          return true
            },
            error : function(xhr, textStatus, errorThrown ) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
                console.log('Stoping trying...');
                return
            }
        
        }); 
                
                
        
//        chrome.runtime.sendMessage(data);

    }
//    ALL_CRAWLED.categories=true;
    } catch (e) {
        console.log(e)
        
        count--;
        getDemographicsAndBehaviors(count)
        return 

//        window.setTimeout(getDemographicsAndBehaviors,1000)
    }
                
            
        
	
})
    




}





function checkForBehaviors(){
           if (!localStorage[CURRENT_USER_ID+'consent'] || (localStorage[CURRENT_USER_ID+'consent'].length==0) || (localStorage[CURRENT_USER_ID+'consent']!=="true") ) {
       if (CURRENT_USER_ID===-1) {
           window.setTimeout(checkForBehaviors,ONEMINUTE)
                     return  
           
       }        
     console.log(JSON.stringify({user_id:CURRENT_USER_ID}))
    var dat = {user_id:CURRENT_USER_ID};
    $.ajax({
        url:URLS_SERVER.getConsent,
        type:REQUEST_TYPE,
        data:dat,
     dataType: "json",
    traditional:true,
        success: function(resp){ 
                console.log(resp)
                if (resp.consent==true) {
                    localStorage[CURRENT_USER_ID+'consent']=true
                      return true
                }
        
                      return true
            },
        error:function() {
        console.log('request failed');
    }
        })

                     window.setTimeout(checkForBehaviors,ONEMINUTE)
                     return  
              }
    
    
        var lastTs = localStorage.lastBehaviorCrawl? localStorage.lastBehaviorCrawl:0
    if (!lastTs) {
        lastTs = 0;
    }
    
    ts = (new Date()).getTime()
    if (ts-lastTs > DAY_MILISECONDS/2) {
        getDemographicsAndBehaviors(3)
    }
    
    
    window.setTimeout(checkForBehaviors,ONEMINUTE)

}



function getInterests() {
    
    chrome.tabs.query({}, function(tabs){
        
        for (let i=0;i<tabs.length;i++) {
            try{
                                    chrome.tabs.sendMessage(tabs[i].id, {type: "getInterests"}, function(response) {});  

            } catch (err) {
                console.log(err)
            }
//            if (tabs[i].url.indexOf('facebook.com') !== -1) {
//                    ret.urn
//            }
        }
});
    
    
}
    
function getAdvertisers() {
    
    chrome.tabs.query({}, function(tabs){
        
        for (let i=0;i<tabs.length;i++) {
            try{
//            if (tabs[i].url.indexOf('facebook.com') !== -1) {
                    chrome.tabs.sendMessage(tabs[i].id, {type: "getAdvertisers"}, function(response) {});  
//                    return
//            }
            } catch (err) {
                console.log(err)
            }
        
        }
});
    
    
}
function checkForInterests(){
           if (!localStorage[CURRENT_USER_ID+'consent'] || (localStorage[CURRENT_USER_ID+'consent'].length==0) || (localStorage[CURRENT_USER_ID+'consent']!=="true") ) {
       if (CURRENT_USER_ID===-1) {
           window.setTimeout(checkForInterests,ONEMINUTE)
                     return  
           
       }        
     console.log(JSON.stringify({user_id:CURRENT_USER_ID}))
    var dat = {user_id:CURRENT_USER_ID};
    $.ajax({
        url:URLS_SERVER.getConsent,
        type:REQUEST_TYPE,
        data:dat,
     dataType: "json",
    traditional:true,
        success: function(resp){ 
                console.log(resp)
                if (resp.consent==true) {
                    localStorage[CURRENT_USER_ID+'consent']=true
                      return true
                }
        
                      return true
            },
        error:function() {
        console.log('request failed');
    }
        })

                     window.setTimeout(checkForInterests,ONEMINUTE)
                     return  
              }
    
    
        var lastTs = localStorage.lastInterestCrawl?localStorage.lastInterestCrawl:0
    if (!lastTs) {
        lastTs = 0;
    }
    
    ts = (new Date()).getTime()
    if (ts-lastTs > DAY_MILISECONDS/2) {
                console.log('Getting interests')

        getInterests();
    }
    
    
    window.setTimeout(checkForInterests,ONEMINUTE)

}





function checkForAdvertisers(){
           if (!localStorage[CURRENT_USER_ID+'consent'] || (localStorage[CURRENT_USER_ID+'consent'].length==0) || (localStorage[CURRENT_USER_ID+'consent']!=="true") ) {
       if (CURRENT_USER_ID===-1) {
           window.setTimeout(checkForAdvertisers,ONEMINUTE)
                     return  
           
       }        
     console.log(JSON.stringify({user_id:CURRENT_USER_ID}))
    var dat = {user_id:CURRENT_USER_ID};
    $.ajax({
        url:URLS_SERVER.getConsent,
        type:REQUEST_TYPE,
        data:dat,
     dataType: "json",
    traditional:true,
        success: function(resp){ 
                console.log(resp)
                if (resp.consent==true) {
                    localStorage[CURRENT_USER_ID+'consent']=true
                      return true
                }
        
                      return true
            },
        error:function() {
        console.log('request failed');
    }
        })

                     window.setTimeout(checkForAdvertisers,ONEMINUTE)
                     return  
              }
    
    
        var lastTs = localStorage.lastAdvertiserCrawl?localStorage.lastAdvertiserCrawl:0
    if (!lastTs) {
        lastTs = 0;
    }
    
    ts = (new Date()).getTime()
    if (ts-lastTs > DAY_MILISECONDS/2) {
        console.log('Getting advertisers')
        getAdvertisers();
    }
    
    
    window.setTimeout(checkForAdvertisers,ONEMINUTE)

}


checkForBehaviors();
checkForAdvertisers();
checkForInterests();






//
//
//function checkForPreferences() {
//       if (!localStorage.consent || (localStorage.consent.length==0) || (localStorage.consent!=="true") ) {
//       if (CURRENT_USER_ID===-1) {
//           window.setTimeout(checkForPreferences,FIFTEENMINUTES)
//                     return  
//           
//       }        
//     console.log(JSON.stringify({user_id:CURRENT_USER_ID}))
//    var dat = {user_id:CURRENT_USER_ID};
//    $.ajax({
//        url:URLS_SERVER.getConsent,
//        type:REQUEST_TYPE,
//        data:dat,
//     dataType: "json",
//    traditional:true,
//        success: function(resp){ 
//                console.log(resp)
//                if (resp.consent==true) {
//                    localStorage.consent=true
//                      return true
//                }
//        
//                      return true
//            },
//        error:function() {
//        console.log('request failed');
//    }
//        })
//
//                     window.setTimeout(checkForPreferences,FIFTEENMINUTES)
//                     return  
//              }
//
//    
//    
//    
//    
//    var lastTs = localStorage.lastCrawl
//    if (!lastTs) {
//        lastTs = 0;
//    }
//    
//    ts = (new Date()).getTime()
//    if (ts-lastTs > DAY_MILISECONDS) {
//        getPreferences();
//    }
//    
//    
//    window.setTimeout(checkForPreferences,FIFTEENMINUTES)
//}
//
//function crawlingDone(){
//    var keys = Object.keys(PREFERENCESCRAWLED);
//    for (let i=0;i<keys.length;i++) {
//        if (!PREFERENCESCRAWLED[keys[i]]) {
//            return false
//        }
//    }
//    return true
//    
//    
//}
//
//
//function handleCrawlingDone() {
//    if (CRAWLINGPREFERENCES &&  crawlingDone()) {
//        localStorage.lastCrawl= (new Date()).getTime()
//        if (PREFERENCESTAB!=-1) {
////            alert('Crawling Done! Thank you very much! See you tomorrow! :)');
//            chrome.tabs.remove(PREFERENCESTAB);
//        }
//        
//        PREFERENCESTAB=-1;
//        PREFERENCESCRAWLED = {advertisers:false,interests:false,demBeh:false};
//        CRAWLINGPREFERENCES = false;
//        
//    }
//    
//    window.setTimeout(handleCrawlingDone,5000);
//}
//
//checkForPreferences()
//handleCrawlingDone()


function prepareHomePage() {
    var xmlhttp = new XMLHttpRequest();
        var url_request = "https://www.facebook.com/";
        xmlhttp.open("GET",url_request, true);
     xmlhttp.onload = function (e) {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
             response = xmlhttp.responseText;
            var head = response.match(/<head[^>]*>[\s\S]*<\/head>/gi);
            var hdln = "<head>".length;
            var shdln = "</head>".length;
            head =  head[0].slice(hdln,head[0].length-shdln)
            
            var body = response.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
            body = body.slice(hdln,body.length-shdln)
            
//                
            document.head.insertAdjacentHTML( 'beforeend', head ); 
            document.body.insertAdjacentHTML('beforeend',body);
            
            var playground = document.createElement("div"); 
            playground.setAttribute('id','playground');
            var title = document.createElement('h1');
            var textnode = document.createTextNode("PLAYGROUND FOR APP"); 
            var adSpace = document.createElement("div")
            adSpace.setAttribute('id',ADSPACE)
            title.appendChild(textnode);
            playground.appendChild(title);
            playground.appendChild(adSpace);
            document.body.appendChild(playground);
            
            //            backgroundWindow = chrome.extension.getBackgroundPage()
//            outerHTML = jQuery.parseHTML(response)
    
            
        }
     }
     xmlhttp.send(null);


}




//chrome.webRequest.onHeadersReceived.addListener(
//    function(info) {
//      var headers = info.responseHeaders;
//      var index = headers.findIndex(x=>x.name.toLowerCase() == "x-frame-options");
//      if (index !=-1) {
//        headers.splice(index, 1);
//      }
//      return {responseHeaders: headers};
//    },
//    {
//        urls: ['*://*.facebook.com/*'], //
//        types: ['sub_frame']
//    },
//    ['blocking', 'responseHeaders']
//);

function mediaRequestsDone(reqId) {
     let allDone = true;
                for (let key in MEDIA_REQUESTS[reqId]) {
                    if (MEDIA_REQUESTS[reqId][key].length<=0){
                        console.log(MEDIA_REQUESTS[reqId][key].length)
                        allDone= false;
                        break
                    }
                }
    return allDone
}



function sendFrontAd(request,sendResponse) {
    
    console.log('Front ad...');
//        ADQUEUE.push(request)
//        resp = {queued:true,hover:true}
//        sendResponse(resp);
        
        
    
          delete request[MSG_TYPE];
          var reqId = MEDIA_REQUEST_ID++;
          var imgsToCrawl = request[IMAGES];
          if ((request[ADV_PROF_PIC]) && (request[ADV_PROF_PIC].length>0)) {
              imgsToCrawl.push(request[ADV_PROF_PIC])
          }
          MEDIA_REQUESTS[reqId] = {};
          for (let i =0 ; i<imgsToCrawl.length; i++) {
              MEDIA_REQUESTS[reqId][imgsToCrawl[i]] = '';
//              console.log(MEDIA_REQUESTS[reqId])
              getBase64FromImageUrl(imgsToCrawl[i],reqId,request,sendResponse)
          }
          
       
          
          console.log(request)
          
         
        return true
}


function sendSideAd(request,sendResponse) {
        console.log('SENDING Side ad...');
          console.log(request);
          delete request[MSG_TYPE];
              var reqId = MEDIA_REQUEST_ID++;
          var imgsToCrawl = request[IMAGES];
        
          MEDIA_REQUESTS[reqId] = {};
          for (let i =0 ; i<imgsToCrawl.length; i++) {
              MEDIA_REQUESTS[reqId][imgsToCrawl[i]] = '';
//              console.log(MEDIA_REQUESTS[reqId])
            
              getBase64FromImageUrl(imgsToCrawl[i],reqId,request,sendResponse)
          }
          
//          $.ajax({
//              type: REQUEST_TYPE,
//              url: URLS_SERVER.registerAd,
//              data: request,
//              success: function (a) {
//                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
//                      console.log('Failure');
//                      console.log(a)
//                      sendResponse({"saved":false});};
//
//                      
//                  
//                  console.log('Success');
////                  console.log(sendResponse)
//                  sendResponse({"saved":true});},
//            }).fail(function(a){
//              console.log('Failure');
//              console.log(a)
//              sendResponse({"saved":false});});
    
}


function getConsentStatus(sendResponse){
        if ((CURRENT_USER_ID==-1) || (!CURRENT_USER_ID)) {
        sendResponse({"consent":false,notLoggedIn:true})
        return true
    }
    if (localStorage[CURRENT_USER_ID+'consent'] && (localStorage[CURRENT_USER_ID+'consent'].length>0)) {
                  if (localStorage[CURRENT_USER_ID+'consent']==="true") {
                      console.log('Sending consent')
                      sendResponse({"consent":true})
                      return true
                  }
                  
                  
              }
    console.log(JSON.stringify({user_id:CURRENT_USER_ID}))

    var dat = {user_id:CURRENT_USER_ID};
    $.ajax({
        url:URLS_SERVER.getConsent,
        type:REQUEST_TYPE,
        data:dat,
     dataType: "json",
    traditional:true,
        success: function(resp){ 
                console.log(resp)
                if (resp.consent==true) {
                    console.log('Sending consent FROM here...')
                    localStorage[CURRENT_USER_ID+'consent']=true
                      sendResponse({"consent":true})
                      return true
                }
        
                    sendResponse({"consent":false})
                      return true
            },
        error:function() {
        console.log('request failed');
        sendResponse({"consent":false})
    }
        
        
    })
                     return true
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
//      if (request[MSG_TYPE] === SIDEADINFO) {
//          var adId = request.adId;
//      
//      if (!(sender.tab.id in FLAG)) {
//          FLAG[sender.tab.id] = {};
//      }
//      
//      FLAG[sender.tab.id][adId] = true;
//      sendResponse({"ad_status":OK});
//      return
//        
//      }
      
      if (!sender.tab) {
          if (request.setConsent) {
              
              if (CURRENT_USER_ID==-1) {
                    sendResponse({"ok":false})

              }
              
               $.ajax({
        url:URLS_SERVER.registerConsent,
        type:REQUEST_TYPE,
        data:{user_id:CURRENT_USER_ID},
     dataType: "json",
    traditional:true,
        success: function(resp){ 
                console.log(resp)
                if (resp.consent==true) {
                    console.log('Sending consent FROM here...')
                    localStorage[CURRENT_USER_ID+'consent']=true
                      sendResponse({"ok":true})
                      return true
                }
        
                    sendResponse({"ok":false})
                      return true
            },
        error:function() {
        console.log('request failed');
        sendResponse({"ok":false})
        return true
    }
        
        
    })
              

          return true
          }
          
          if (request.getConsent) {
              getConsentStatus(sendResponse)
              return true
          }
      }
      
      if (sender.tab) {
          console.log(request)
                if (request[MSG_TYPE] == 'consent') {
                    console.log('getting consent status')
                    getConsentStatus(sendResponse)
                        return true

                }


          
      if (request[MSG_TYPE] == SIDEADINFO) {
          CURRENT_USER_ID = request['user_id'];
          console.log('SideAd');
          console.log(request);
          sendSideAd(request,sendResponse)
//          console.log(request);
          return true

      }
      if (request[MSG_TYPE] == FRONTADINFO) {
        CURRENT_USER_ID = request['user_id'];
          sendFrontAd(request,sendResponse);
          return true
      }

    if (request[TYPE] == TYPES.advertisers) {
        CURRENT_USER_ID = request['user_id'];
        console.log('advertisers...')
        console.log(request)
        console.log( URLS_SERVER.registerAdvertisers);
        if (CRAWLINGPREFERENCES) {
            PREFERENCESCRAWLED.advertisers=true;
        }
        if ((localStorage.collectPrefs!=='true') || (localStorage[CURRENT_USER_ID+'consent']!=='true')) {
            return
        }
        $.ajax({
              type: REQUEST_TYPE,
              url: URLS_SERVER.registerAdvertisers,
              dataType: "json",
             traditional:true,
              data: JSON.stringify(request),
                tryCount : 0,
                retryLimit : 3,
              success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                    this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
                    }
                    console.log('Stoping trying...');
                return
                   
                return true};
                  

            localStorage.lastAdvertiserCrawl = (new Date()).getTime()                
//          sendFrontAd(request,sendResponse);
          return true
            },
            error : function(xhr, textStatus, errorThrown ) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
                console.log('Stoping trying...');
                return
            }
        
        }); 
        return true
      }
      
      if (request[TYPE] == TYPES.interests) {
        CURRENT_USER_ID = request['user_id'];
        console.log('interests...')
        console.log(request)
                if (CRAWLINGPREFERENCES) {
            PREFERENCESCRAWLED.interests=true;
        }
         if ((localStorage.collectPrefs!=='true') || (localStorage[CURRENT_USER_ID+'consent']!=='true')) {
            return
        }
        $.ajax({
              type: REQUEST_TYPE,
              url: URLS_SERVER.registerInterests,
              dataType: "json",
             traditional:true,
              data: JSON.stringify(request),
                tryCount : 0,
                retryLimit : 3,
              success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                    this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
                    }
                    console.log('Stoping trying...');
                return
                   
                return true};
                  
                  localStorage.lastInterestCrawl = (new Date()).getTime()    
                
//          sendFrontAd(request,sendResponse);
          return true
            },
            error : function(xhr, textStatus, errorThrown ) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
                console.log('Stoping trying...');
                return
            }
        
        });         
          return true
      }
      
        if (request[TYPE] == TYPES.demographics) {
        CURRENT_USER_ID = request['user_id'];
        console.log('demographics...')
        console.log(request)
        if (CRAWLINGPREFERENCES) {
            PREFERENCESCRAWLED.demBeh=true;
        }
         if ((localStorage.collectPrefs!=='true') || (localStorage[CURRENT_USER_ID+'consent']!=='true')) {
            return
        }
         $.ajax({
              type: REQUEST_TYPE,
              url: URLS_SERVER.registerDemBeh,
              dataType: "json",
             traditional:true,
              data: JSON.stringify(request),
                tryCount : 0,
                retryLimit : 3,
              success: function (a) {
                if (!a[STATUS] || (a[STATUS]==FAILURE)) {
                    this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
                    }
                    console.log('Stoping trying...');
                return
                   
                return true};
               localStorage.lastBehaviorCrawl = (new Date()).getTime();

//          sendFrontAd(request,sendResponse);
          return true
            },
            error : function(xhr, textStatus, errorThrown ) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                console.log('Trying again...')

                $.ajax(this);
                return;
            }
                console.log('Stoping trying...');
                return
            }
        
        }); 
        }
  }

  });

//FACEBOOK LOGIN

var successURL = 'www.facebook.com/connect/login_success.html';

function onFacebookLogin(){
  if (!localStorage.getItem('accessToken')) {
    chrome.tabs.query({}, function(tabs) { // get all tabs from every window
      for (var i = 0; i < tabs.length; i++) {
         if (!tabs[i].url) {continue}
        if (tabs[i].url.indexOf(successURL) !== -1) {
          // below you get string like this: access_token=...&expires_in=...
          var params = tabs[i].url.split('#')[1];

          // in my extension I have used mootools method: parseQueryString. The following code is just an example ;)
          var accessToken = params.split('&')[0];
          accessToken = accessToken.split('=')[1];
        

          localStorage.setItem('accessToken', accessToken);
//          chrome.tabs.remove(tabs[i].id);
        }
      }
    });
  }
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);
