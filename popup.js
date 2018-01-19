$('#notLoggedInView').hide()

FIVE_SECONDS = 5000;
THIRTY_SECONDS = 6*FIVE_SECONDS

// var consent= false;
if (!localStorage.collectPrefs) {
    localStorage.collectPrefs=true;
}
function getCollectPrefs(){
    
       if (localStorage.collectPrefs=='true') {
           document.getElementById('collectPrefs').checked=true;
           return;
        } 
            document.getElementById('collectPrefs').checked=false;
    
    
}

function getConsent() {
    chrome.runtime.sendMessage({'getConsent':true},function(response) {
        console.log('Getting consent');
        console.log(response)
        if (response.consent) {
            $('#consentForm').hide()
            $('#notLoggedInView').hide()

            
//            $('#consentButton').remove()
            $('#normalView').show()
                    setTimeout(getConsent,FIVE_SECONDS)

            return;
        } 
        
        if (response.notLoggedIn) {
        $('#notLoggedInView').show()
        $('#normalView').hide()
                    $('#consentForm').hide()

                                    setTimeout(getConsent,FIVE_SECONDS)

                                    return
//        $('#consentButton').hide()
        
        }
        $('#notLoggedInView').hide()
        $('#consentForm').show()
        setTimeout(getConsent,FIVE_SECONDS)

    })
//    if (localStorage.consent=='true') {
//            $('#consentForm').hide()
//            $('#consentButton').remove()
//            $('#normalView').show()
//    }
    }
    $(document).ready(function(){
        
        //TODO: ASK IF THE USER HAS CONSENT
                    console.log('clicked')
        $('#normalView').hide()
        
        getConsent();
        getCollectPrefs();
         $('#consentButton').click(function(){
             console.log('clicked')
             
             
             chrome.runtime.sendMessage({"consent":true,"setConsent":true}, function(response) {
                console.log(response)
                
            if (response.ok) {
                console.log('Consent received');
                $('#notLoggedInView').hide()

                $('#consentForm').hide();
                $('#consentButton').remove()
                $('#normalView').show()
                consent= true
                return
                            }
                 
                console.log('Consent failed');
                 let errorMessage = '  <div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> <strong>Danger!</strong> Something went wrong! Please try again!</div>'
                 
                 $('#consentForm').append(errorMessage)
                 
                 
                 
                 
                
                 
                            }
         )
//        if (localStorage.consent=='true'){
//            $('#consentForm').hide()
//            $('#consentButton').remove()
//            $('#normalView').show()
////            TODO: SHOW THE OTHER FORM
//        }
              
       
        
        
        })
         
         $('#collectPrefs').click(function() {
             
             localStorage.collectPrefs=document.getElementById('collectPrefs').checked
                 
     
             
         });
         
         
         
         
         
         
    });

// window.fbAsyncInit = function() {
//    FB.init({
//      appId      : '769242713247780',
//      cookie     : true,
//      xfbml      : true,
//      version    : 'v2.8'
//    });
////    FB.AppEvents.logPageView(); 
//     $(document).trigger('fbload'); 
//  };
//
////  (function(d, s, id){
////     var js, fjs = d.getElementsByTagName(s)[0];
////     if (d.getElementById(id)) {return;}
////     js = d.createElement(s); js.id = id;
////     js.src = "//connect.facebook.net/en_US/sdk.js";
////     fjs.parentNode.insertBefore(js, fjs);
////   }(document, 'script', 'facebook-jssdk'));
//    
////document.addEventListener('DOMContentLoaded', function() {
////    FB.getLoginStatus(function(response) {
////    statusChangeCallback(response);
////    console.log(response)
////});
////    
////    function checkLoginState() {
////  FB.getLoginStatus(function(response) {
////    statusChangeCallback(response);
////  });
////    
////}
////    
////})
//
//
//
//$(document).on(
//    'fbload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
//    function(){
//        //some code that requires the FB object
//        //such as...
//        FB.getLoginStatus(function(res){
//            console.log(res)
//            if( res.status == "connected" ){
//                FB.api('/me', function(fbUser) {
//                    console.log("Open the pod bay doors, " + fbUser.name + ".");
//                });
//            }
//        });
//
//        
//            function checkLoginState() {
//  FB.getLoginStatus(function(response) {
//    statusChangeCallback(response);
//  });
//    }
//    }
//);