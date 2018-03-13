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

//if the UI breaks, then consider using the webNavigation API


//interval is 5 seconds
var INTERVAL = 5000;
var MSG_TYPE = 'message_type';
var FRONTADINFO = 'front_ad_info';
var SIDEADINFO = 'side_ad_info'

//helps synchronize
var allDone = {};

// sideAds = getSideAds();
//chrome.runtime.sendMessage({sideAds: sideAds}, function(response) {
//  console.log(response.farewell);
//});
var sideAds= {};
var TOPURL = '';
var FRONTADQUEUE= {};
var EXPLANATIONSURL = 'https://www.facebook.com/ads/preferences/dialog/?';

var ASYNCPARAMS = {};
var ASYNCPARAMSGET = {};

function updateAsyncParams() {
    data = {asyncParams:true}
    window.postMessage(data,"*")
}

updateAsyncParams();





//window.addEventListener("scroll", function() {
//    var newSideAds = getSideAds();
//    
//    var adsToSend = getNewAds(sideAds,newSideAds);
//    
//    var noNewAds = Object.keys(adsToSend).length;
//    if (noNewAds>0) {
////        console.log(adsToSend)
//        console.log('Sending sideads...')
//            chrome.runtime.sendMessage({sideAds: adsToSend} );
//        sideAds = newSideAds;
//        console.log(sideAds);
//    }
//});


function addToFrontAdQueue(ad) {
    if (Object.keys(FRONTADQUEUE).length<=0) {
        FRONTADQUEUE[0] = ad;
        return true
    } 
    
    var nextNum = Math.max.apply(null,Object.keys(FRONTADQUEUE).map(function (x) {return parseInt(x)})) +1 
    FRONTADQUEUE[nextNum] = ad;
    return true;
    
}



function getAdFromButton(qId,buttonId) {
//    console.log(FRONTADQUEUE);
//    console.log(Object.keys(FRONTADQUEUE));
//    

    for (let i in FRONTADQUEUE) {
        console.log(qId);
        console.log(buttonId,FRONTADQUEUE[i].buttonId);
        if ((FRONTADQUEUE[i].buttonId===buttonId)) {
            var ad = FRONTADQUEUE[i];
            FRONTADQUEUE[i]= {raw_ad:""};
            return ad;
        }
        
    }
    return NaN
};

function assignProcessingSign(sideAd) {
    sideAd.style.opacity = 0;
//        var image_elem = document.createElement('img');
//    image_elem.src = img
//    image_elem.setAttribute('id','lala')
//    sideAd.parentElement.
//    sideAd.parentElement.appendChild(image_elem)
//    var oTop = sideAd.offsetTop;
//var oLeft = sideAd.offsetLeft;
//    var oHeight = sideAd.offsetHeight;
//    var oWidth = sideAd.offsetWidth;
//image_elem.style.top = oTop + 'px';
//image_elem.style.left = oLeft + 'px';
//    image_elem
//
//image_elem.style.position = "absolute";
    
}

function toggleOpacity(elem) {
    if (elem.style.opacity=="0") {
        elem.style.opacity = 1;
        return;
    }
    elem.style.opacity=0;
}


//function clickOnMenusAds(sideAds) {
//    var notProcessed = new Set([]);
////    console.log(sideAds)
//    for (let adId in sideAds) {
////        console.log('Processing ' + adId)
//        let sideAd = sideAds[adId];
////        hide element
////        toggleOpacity(sideAd);
////        get menu
//       var menus = get_dropdown_ad_menus(sideAd);
//        if (menus.length===0) {
//            console.log("Couldn't grab menu for ");
//            console.log(sideAd);
//            notProcessed.add(adId);
//
//            continue
//        }
//        var menu = menus[0];
//        menu.click();
//        menu.click();
//        
//        
//        var ads = get_ads(sideAd);
//        var counter = 0;
//        var MAX_TIME = 10;
//        function checkFlag(sideAd) {
//                if  ((counter<MAX_TIME) || (Object.keys(ads).length==0)) {
//                    counter++;
//                         menu.click();
//                        menu.click()
////                    console.log('Trying to grab ads again...');
//                    ads = get_ads(sideAd);
//                   window.setTimeout(checkFlag, 100,sideAd); /* this checks the flag every 100 milliseconds*/
//                } else {
//                     if (Object.keys(ads).length==0) {
//            console.log('Problem with ad');
//            console.log(sideAd);
//            notProcessed.add(adId);
//         allDone[adId]=true;
//
//            return
//
//        }
////        send message to be registered
////        console.log('sending message')
//        
//        chrome.runtime.sendMessage({"adId": adId}, function(response) {
//            console.log(response.ad_status);
//            if (response.ad_status===OK) {
//                console.log(ads)
//                var ad= ads[adId];
////                console.log('clicking on ad')
//                ad.click();
//                            allDone[adId]=true;
//                            return;
//
//                
//            }
//            
//            notProcessed.add(adId);
//            allDone[adId]=true;
//            return;
//            }
//                                  
//            );
//                    
//                }
//            }
//        
//        checkFlag(sideAd);
//
//       
//        
//    }
//    console.log('Not Processed:');
//    console.log(notProcessed)
//    return notProcessed
//}
//    


//function clickOnMenusAd(adId,sideAd) {
////    sideAds[adId] = sideAd;
//
//    console.log('Processing ' + adId);
////        hide element
////        toggleOpacity(sideAd);
////        get menu
//       var menus = get_dropdown_ad_menus(sideAd);
//        if (menus.length===0) {
//            console.log("Couldn't grab menu for ");
//            console.log(sideAd);
//            delete sideAds[adId];
//            return
//        }
//        var menu = menus[0];
//        menu.click();
//        menu.click();
//        
//        
//        var ads = get_ads(sideAd);
//        var counter = 0;
//        var MAX_TIME = 10;
//        function checkFlag(sideAd) {
//                if  (Object.keys(ads).length==0) {
//                    if (counter<MAX_TIME) {
//                    counter++;
//                         menu.click();
//                        menu.click()
////                    console.log('Trying to grab ads again...');
//                    ads = get_ads(sideAd);
//                   window.setTimeout(checkFlag, 100,sideAd); /* this checks the flag every 100 milliseconds*/
//                        return
//                }
//                    else  {
//                     
//            console.log('Problem with ad');
//            console.log(sideAd);
//                        delete sideAds[adId]
//                         allDone[adId]=true;
//            return
//                    }
//
//        } else {
////        send message to be registered
////        console.log('sending message');
//        
//        chrome.runtime.sendMessage({"adId": adId}, function(response) {
//            console.log(response.ad_status);
//            if (response.ad_status===OK) {
//                console.log(ads)
//                var ad= ads[adId];
//                
////                console.log('clicking on ad: '+adId)
//                ad.click();
//                            allDone[adId]=true;
//                            return;
//
//                
//            }
//            
//            delete sideAds[adId]
//            allDone[adId]=true;
//            return;
//            }
//                                  
//            );}
//                    
//                }
//            checkFlag(sideAd);
//
//            }
//        


function clickOnMenusAd(adId,sideAd,adData) {
//    sideAds[adId] = sideAd;

    console.log('Processing ' + adId);
//        hide element
//        toggleOpacity(sideAd);
//        get menu
       var menus = get_dropdown_ad_menus(sideAd[DOM_AD]);
        if (menus.length===0) {
            console.log("Couldn't grab menu for ");
            console.log(sideAd);
            sideAd[DOM_AD].classList.remove(COLLECTED);          
            return
        }
        var menu = menus[0];
        menu.click();
        menu.click();
        
        
        var ads = getAds(sideAd[DOM_AD]);
        var counter = 0;
        var MAX_TIME = 10;
        function checkFlag(sideAd) {
                if  (Object.keys(ads).length==0) {
                    if (counter<MAX_TIME) {
                    counter++;
                         menu.click();
                        menu.click()
//                    console.log('Trying to grab ads again...');
                    ads = getAds(sideAd[DOM_AD]);
                   window.setTimeout(checkFlag, 100,sideAd); /* this checks the flag every 100 milliseconds*/
                        return
                }
                    else  {
                     
            console.log('Problem with ad');
            console.log(sideAd);
            sideAd[DOM_AD].classList.remove(COLLECTED);          

            return
                    }

        } else {
//        send message to be registered
//        console.log('sending message');
            
            var adToClick= ads[adId];
            chrome.runtime.sendMessage(adData, function(response) {
            console.log(response.saved);
            console.log(response)
                
            if (response.saved!==true) {
                console.log('Problem with SideAd');
                sideAd[DOM_AD].classList.remove(COLLECTED);

//                if (sideAds[adId]) {
//                    delete sideAds[adId];
//                    };
                return
                }
                
            if (response.click) {
                console.log('Clicking');
                console.log(adToClick)
                adToClick.click()
            }
                
            })
                                  
           }
                    
                }
            checkFlag(sideAd);

            }
        
       
//        
//function clickOnAdMenusFrontAds(frontAd,adData) {
////    sideAds[adId] = sideAd;
//
//    console.log('Processing frontAd' );
////        hide element
////        toggleOpacity(sideAd);
////        get menu
//        var [adId,ad,buttonId] = getFrontAdExplanationLink(frontAd);
//        var counter = 0;
//        var MAX_TIME = 20;
//        console.log([adId,ad])
//        function checkFlag(frontAd) {
//                if  (adId==false) {
//                    if (counter<MAX_TIME) {
//                        counter++;
//                    [adId,ad,buttonId] = getFrontAdExplanationLink(frontAd)
//                    console.log([adId,ad])
//
//                   window.setTimeout(checkFlag, 100,frontAd); /* this checks the flag every 100 milliseconds*/
//                        return
//                }
//                    else  {
//                     
//            console.log('Problem with ad');
//            console.log(frontAd);
//            frontAd.classList.remove(COLLECTED);          
//
//            return
//                    }
//
//        } else {
////        send message to be registered
////        console.log('sending message');
//            adData.fb_id = adId;
//            adData.raw_ad += '||'+ ad.innerHTML;
//            adData.button_id = buttonId;
//
//            chrome.runtime.sendMessage(adData, function(response) {
//            console.log(response.saved);
//            console.log(response)
//                
//            if (response.saved!==true) {
//                console.log('Problem with FrontAd');
//                frontAd.classList.remove(COLLECTED);
//
////                if (sideAds[adId]) {
////                    delete sideAds[adId];
////                    };
//                return
//                }
//                
//            if (response.click) {
//                console.log('Clicking');
//                console.log(ad)
//                ad.click()
//            }
//                
//            })
//                                  
//           }
//                    
//                }
//            checkFlag(frontAd);
//
//            }
//


     
function getExplanationUrlFrontAds(frontAd,adData) {
//    sideAds[adId] = sideAd;

    console.log('Processing frontAd' );
//        hide element
//        toggleOpacity(sideAd);
//        get menu
        var buttonId = getButtonId(frontAd)
        
//        var params = require('getAsyncParams')();
        adData.buttonId = buttonId;
//        adData.requestParams = params;
        addToFrontAdQueue(adData);
        hoverOverButton(frontAd);
    
    
    
        
//        chrome.runtime.sendMessage(adData, function(response) {
//            console.log(response.queued);
//            console.log(response)
//                
//            if (response.queued!==true) {
//                console.log('Problem with FrontAd');
//                frontAd.classList.remove(COLLECTED);
//
////                if (sideAds[adId]) {
////                    delete sideAds[adId];
////                    };
//                return true
//                }
//                
//            if (response.hover) {
//                console.log('Hovering');
//                hoverOverButton(frontAd)
//                
//            }
//                
//            });
    
    return true;
    
    
    
                    
                    

            }

        


function grabFrontAds() {



    if (window.location.href.indexOf('ads/preferences')==-1) {
        
  
    console.log('Grabbing front ads...')
    var frontAds = getFrontAdFrames();
    console.log(frontAds);
    for (let i=0;i<frontAds.length;i++) {
        let adData = processFrontAd(frontAds[i]);
        adData[MSG_TYPE] = FRONTADINFO;
            getExplanationUrlFrontAds(frontAds[i],adData);
        }
      }
    setTimeout(grabFrontAds, INTERVAL);
}


function grabAds() {
  // do some work here
//    let currURL = window.location.href;
//    if (currURL !== TOPURL) {   
//        console.log('Location changed from ' + TOPURL + ' to '+currURL);
//        sideAds = {}
//        TOPURL = currURL;
//        
//    }
//    console.log('SIDEADS');
//    console.log(sideAds);
//    console.log(window.location.href )
//    console.log("https://www.facebook.com/ads/preferences/")
    
//    console.log(ASYNCPARAMS);
    if (Object.keys(ASYNCPARAMS).length<=0){
        updateAsyncParams();
        console.log("need to update asyncparams...");
        setTimeout(grabAds, INTERVAL);
        return;
        
    }
    if (window.location.href.indexOf('ads/preferences')==-1) {
    sideAds = getSideAds();
    
//    IN ORDER TO AVOID THE CONCURENCY ISSUES, I ASSIGNE THESE ADS AS TAKEN

//    var adsToProcess = getNewAds(sideAds,newSideAds);
    
    
    var noNewAds = Object.keys(sideAds).length;
    
    if (noNewAds>0) {
//        console.log(adsToProcess)
//        console.log('Processing sideads...')
//        allDone = {}
        let adsToProcessKeys =Object.keys(sideAds);
//        console.log(adsToProcessKeys);
        for (var i=0; i<adsToProcessKeys.length;i++) {
            let adId = adsToProcessKeys[i];
            console.log('Processing '+ adId);
//            sideAds[adId] = adsToProcess[adId];
             
//            TODO: TO BE EMPLOYED LATER
//                    clickOnMenusAd(adId,adsToProcess[adId]);
             let adData = processSideAd(sideAds[adId],adId);
            adData[MSG_TYPE] = SIDEADINFO;

            var sideAd = sideAds[adId];
            var menus = get_dropdown_ad_menus(sideAd[DOM_AD]);
            var link = menus[0].getAttribute('ajaxify')
            var urlAj = '/ajax/a.php?'
            var pars = createObjFromURI(link.replace(urlAj,''));
            var paramsFinal = Object.assign(pars,ASYNCPARAMS)
            paramsFinal['nctr[_mod]']='pagelet_ego_pane';
            var oldGetParams = ASYNCPARAMSGET;
             updateAsyncParams();
            console.log(adId);

            
             $.ajax({
                 type:'POST',
                 url:'/ajax/a.php?dpr=1',
                 data:paramsFinal,
                 success: function(resp) {
                     console.log(adId)
                     var results = grabParamsFromSideAdAjaxify(resp);
                     if (!results) {
                         console.log("Couldn't grab...")
                         console.log(resp)
                         return true;
                     }
                     adData.explanationUrl = EXPLANATIONSURL + results.requestParams + '&' + $.param(oldGetParams);
                    chrome.runtime.sendMessage(adData, function(response) {console.log(response)});
                     return true

                     
                     
                     
                     
                 }
             });
            
//            adData.explanationUrl = EXPLANATIONSURL
//            clickOnMenusAd(adId,sideAds[adId],adData);


            
        }

    }  
    }

    setTimeout(grabAds, INTERVAL);
  
}

console.log(Math.random())





function permissionToGrab() {

    msg = {}
    msg[MSG_TYPE]='consent'
     chrome.runtime.sendMessage(msg,function(response) {
        if (response.consent){
            console.log('Consent exists, start collecting data')
            grabAds();
            grabFrontAds();
            return true
        }
        
             setTimeout(permissionToGrab, INTERVAL);

     })
    
};


var s = document.createElement("script");
s.src = chrome.extension.getURL("xhrOverloadButtons.js");
(document.head||document.documentElement).appendChild(s);


$(document).ready(function() {
    
    setTimeout(permissionToGrab, 3000);
}) 


window.addEventListener("message", function(event) {
    // We only accept messages from ourselves

    if (event.source != window)
        return;
    
    if (event.data.adButton)  {
        
    console.log('Data received');
    console.log(event.data);
    
    var qId = event.data.qId;
    var buttonId = event.data.buttonId
    var adData = getAdFromButton(qId,buttonId);
    adData.fb_id = event.data.adId;
//    var ad.asynchParams = event.data.asyncParams;
    adData.explanationUrl = EXPLANATIONSURL + event.data.requestParams + '&' + $.param(event.data.asyncParams);
    console.log(adData);
    chrome.runtime.sendMessage(adData, function(response) {console.log(response)});
    return;
    }
//    console.log(event.data)
    if (event.data.asyncParamsReady) {

        ASYNCPARAMS = event.data.paramsPost;
        ASYNCPARAMSGET = event.data.paramsGet;
    }
    
    
    if (event.data.type && (event.data.type=='advertisersData')){
        console.log("Content script received message: ");
        console.log(event.data)
        var data = event.data
        data['user_id'] =getUserId()
        data['timestamp'] = (new Date).getTime();

        chrome.runtime.sendMessage(data);
        }
    
    
    if (event.data.type && (event.data.type=='interestsData')){
        console.log("Content script received message: " );
        var data = event.data
        data['user_id'] =getUserId()
        data['timestamp'] = (new Date).getTime();

        chrome.runtime.sendMessage(data);        

        }
    

})



function onMessageFunction(msg,sender,sendResponse) {
        if (!sender.tab) {
        console.log('FROM background');
        console.log(msg);
        if (msg.type==='getInterests'){
            data = {grabInterests:true}
            window.postMessage(data,"*")
        }
        
        if (msg.type==='getAdvertisers'){
            data = {grabAdvertisers:true}
            window.postMessage(data,"*")
        }
    }

  if (msg.explanation) {
      console.log('AdID: ' +msg.adId)
//    console.log('AdID: ' +msg.adId +'. EXPLANATION: ' + strip(msg.explanation))
  }
}

if (BrowserDetection()=== BROWSERS.CHROME) {
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

        onMessageFunction(msg,sender,sendResponse)

});    
}


if (BrowserDetection()=== BROWSERS.FIREFOX) {
browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

        onMessageFunction(msg,sender,sendResponse)

});    
}





