$('#notLoggedInView').hide()

URL_DASHBOARD = "http://sentinela.local/facebook/";

FIVE_SECONDS = 5000;
THIRTY_SECONDS = 6 * FIVE_SECONDS

// var consent= false;
if (!localStorage.collectPrefs) {
    localStorage.collectPrefs = true;
}
function getCollectPrefs() {
    if (localStorage.collectPrefs == 'true') {
        document.getElementById('collectPrefs').checked = true;
        return;
    }

    document.getElementById('collectPrefs').checked = false;
}

function getConsent() {
    chrome.runtime.sendMessage({ 'getConsent': true }, function (response) {
        console.log('Getting consent');
        console.log(response);

        if (response.consent) {
            $('#consentForm').hide()
            $('#notLoggedInView').hide()
            //            $('#consentButton').remove()
            $('#normalView').show()
            setTimeout(getConsent, FIVE_SECONDS)

            return;
        }

        if (response.notLoggedIn) {
            $('#notLoggedInView').show()
            $('#normalView').hide()
            $('#consentForm').hide()

            setTimeout(getConsent, FIVE_SECONDS)

            return;
        }

        $('#notLoggedInView').hide()
        $('#consentForm').show()
        setTimeout(getConsent, FIVE_SECONDS)

    });
}

$(document).ready(function () {
    console.log('clicked');
    
    var version = chrome.app.getDetails().version;

    $('#resume').attr('href', URL_DASHBOARD + '?__e=' + localStorage['_api_token'] + '&version='+ version);

    $('#normalView').hide()

    getConsent();
    getCollectPrefs();

    $('#consentButton').click(function () {
        console.log('clicked')

        chrome.runtime.sendMessage({ "consent": true, "setConsent": true }, function (response) {
            console.log(response)

            if (response.ok) {
                console.log('Consent received');
                $('#notLoggedInView').hide()

                $('#consentForm').hide();
                $('#consentButton').remove()
                $('#normalView').show()
                consent = true
                return
            }

            console.log('Consent failed');
            
            let errorMessage = '  <div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> <strong>Danger!</strong> Something went wrong! Please try again!</div>'

            $('#consentForm').append(errorMessage);
        });
    });
    
    $('#collectPrefs').click(function () {
        localStorage.collectPrefs = document.getElementById('collectPrefs').checked
    });
});