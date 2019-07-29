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


$('#notLoggedInView').hide()

FIVE_SECONDS = 5000;
THIRTY_SECONDS = 6*FIVE_SECONDS
URL_DASHBOARD = 'https://adanalyst-br.mpi-sws.org/dashboard/facebook';

function getPluginVersion(){
    if (chrome.app)
        return chrome.app.getDetails().version;
    return browser.runtime.getManifest().version;
}

// var consent= false;
if (!localStorage.collectPrefs) {
    localStorage.collectPrefs=true;
}
function getCollectPrefs(){

    if (localStorage.collectPrefs=='true') {
        document.getElementById('collectPrefs').checked = true;
        return;
    }

    document.getElementById('collectPrefs').checked = false;
}

function checkForApiToken (){
    console.log ("Check server for API Token");
    if(!localStorage['_api_token'] || localStorage['_api_token'].length < 60 ){
        $('#resume').hide();
        $('#loading').show();
        setTimeout(checkForApiToken,1000);
    }
    else{
        $('#resume').show();
        $('#loading').hide();
        var version = getPluginVersion ();

        lang = 'pt'
        if(chrome)
            lang = chrome.i18n.getUILanguage()
        else
            lang = browser.i18n.getUILanguage()

        $('#resume').attr('href', URL_DASHBOARD + '?__e=' + localStorage['_api_token'] + '&version='+ version + '&lang='+lang);
    }
}
function getConsent() {
    chrome.runtime.sendMessage({'getConsent':true},function(response) {
        console.log('Getting consent');
        console.log(response);

        if (response.consent) {
            $('#consentForm').hide()
            $('#notLoggedInView').hide()

            
            var version = getPluginVersion ();

            $('#version').html(chrome.i18n.getMessage('version')+': '+ version);

            $('#resume').hide();
            
            checkForApiToken ();

            $('#normalView').show();
            
            setTimeout(getConsent,FIVE_SECONDS)

            return;
        }
        
        if (response.notLoggedIn) {
            $('#notLoggedInView').show()
            $('#normalView').hide()
            $('#consentForm').hide()

            

            setTimeout(getConsent, FIVE_SECONDS);

            return;
            // $('#consentButton').hide()
        
        }

        $('#notLoggedInView').hide()
        $('#consentForm').show()
        setTimeout(getConsent,FIVE_SECONDS)

    });
}

$(document).ready(function(){
        
    console.log('clicked');
        
    $('#normalView').hide()
        
    getConsent();
    getCollectPrefs();
        
    $('#consentButton').click(function(){
        
        console.log('clicked');
                
        chrome.runtime.sendMessage({"consent":true,"setConsent":true}, function(response) {
            console.log(response)
                
            if (response.ok) {
                console.log('Consent received');

                $('#notLoggedInView').hide();
                $('#consentForm').hide();
                $('#consentButton').remove();
                $('#normalView').show();

                consent = true;

                return;
            }

            console.log('Consent failed');
            
            let errorMessage = '  <div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> <strong>Danger!</strong> Something went wrong! Please try again!</div>';
            $('#consentForm').append(errorMessage);
        });   
    });
         
    $('#collectPrefs').click(function() {
        localStorage.collectPrefs=document.getElementById('collectPrefs').checked; 
    });
});

