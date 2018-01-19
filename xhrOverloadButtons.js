var QID_PATT = /qid.[0-9]+/;
var NUMBER_TAG = /[0-9]+/;

var AJAXIFYPATTERN = /ajaxify":"\\\/ads\\\/preferences\\\/dialog\S+?"/
var ADIDPATTERN = /id=[0-9]+/;


var PAYLOAD = 'payload';


var INTERESTSURL = 'ads/profile/interests/?dpr=1'
var ADVERTISERSURL = 'ads/profile/advertisers/?dpr=1'



//button_id=u_ps_0_0_c&

var BUTTON_ID_PATT = /button_id=\S+?&/;

function getQid(url) {
  try {
      return  url.match(QID_PATT)[0].match(NUMBER_TAG)[0];
  } catch (exp) {
      console.log('Exception in getQid:');
      console.log(exp);
      }
    return NaN;
};


function getButtonId(url) {
    
    try {
        return url.match(BUTTON_ID_PATT)[0].replace('button_id=','').replace('&','');
    } catch (exp) {
      console.log('Exception in getButtonId:');
      console.log(exp);
      }
    return NaN;
}


function getAdIdParams(response) {
    
    try {
        
        patt = response.match(AJAXIFYPATTERN)[0].replace()
        
    } catch (exp) {
      console.log('Exception in getAdIdParams:');
      console.log(exp);
      }
    return NaN;
}

(function() {
    var XHR = XMLHttpRequest.prototype;
    // Remember references to original methods
    var open = XHR.open;
    var send = XHR.send;

    // Overwrite native methods
    // Collect data: 
    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    // Implement "ajaxSuccess" functionality
    XHR.send = function(postData) {
        this.addEventListener('load', function() {
            
            if (this._url.indexOf && this._url.indexOf('options_menu/?button_id=') > -1) {
                
                var qId = getQid(this._url);
                var buttonId = getButtonId(this._url);
                
                if ((!qId) || (!buttonId)) {
//                    not relevant
                    return true;
                }
                
                console.log(qId,buttonId)
//                var button_data = JSON.parse(this.responseText.replace("for (;;);", ''));
//                LALALA = this.responseText;
                var requestParams = this.responseText.match(AJAXIFYPATTERN)[0].replace('ajaxify":"\\\/ads\\\/preferences\\\/dialog\\\/?','');
                
                requestParams = requestParams.slice(0,requestParams.length-1);
                console.log(requestParams)
                
                var adId = requestParams.match(ADIDPATTERN)[0].match(NUMBER_TAG)[0];
                var asyncParams = require('getAsyncParams')();
                
                data = {qId:qId,buttonId:buttonId,requestParams:requestParams,adId:adId,adButton:true,asyncParams:asyncParams};
//                console.log(data);
                
                window.postMessage(data,'*');
                return

                
                    
    
            }
            

            
  
            
            //            /* Method        */ this._method
//            /* URL           */ this._url
//            /* Response body */ this.responseText
//            /* Request body  */ postData
        });
        return send.apply(this, arguments);
    };
})();



function param(object) {
//    var frm =document.createElement('form')
//    
//
//    
//    for (var key in item) {
//            var i = document.createElement("input"); //input element, text
//i.setAttribute('type',"text");
//i.setAttribute('name',key);
//i.setAttribute('value',item[key])
//     frm.appendChild(i);   
//    }
//    console.log(frm)
//    return new FormData(frm)


//for ( var key in item ) {
//    formData.set(key, item[key]);
//    console.log(key,item[key])
//    console.log(formData)
//}
//    return formData
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
    }
    return encodedString;
}


getFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
}, new FormData());


function mergeAdvertisers(advertisers_payload){
    var keys = Object.keys(advertisers_payload);
    var advertisers = [];
    for (let i=0;i<keys.length;i++) {
        advertisers = advertisers.concat(advertisers_payload[keys[i]]);
    }
    
    return advertisers
}

function getInterestsAdvs(url,type) {
    
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
//    content-type:
    request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');


    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var intAdvData = JSON.parse(request.responseText.replace('for (;;);',''));
      var data = type!=='advertisers'?{'data':intAdvData[PAYLOAD][type],'type':type+'Data'}:{'data':mergeAdvertisers(intAdvData[PAYLOAD][type]),'type':type+'Data'};
        window.postMessage(data,'*');

      } else {
        // We reached our target server, but it returned an error

      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send(param(require('getAsyncParams')('POST')));
    }







window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
//    console.log(event)
    if (event.source != window)
        return;
//    
//    if (!event.data.asyncParams) 
//        return;
    
    if (event.data.asyncParams) {
            data = {asyncParamsReady:true,paramsPost:require('getAsyncParams')('POST'),paramsGet: require('getAsyncParams')('GET')};
    console.log('Asynch Params required');
    console.log(data)
    window.postMessage(data,'*');
        return true;
    }
    
    if (event.data.grabInterests) {
        getInterestsAdvs(INTERESTSURL,'interests');
        return true;
    }
    
    if (event.data.grabAdvertisers) {
        getInterestsAdvs(ADVERTISERSURL,'advertisers');
        return true;
    }
    
    


    
    })
                        
     
