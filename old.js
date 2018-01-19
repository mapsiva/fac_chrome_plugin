
    //TODO: if user not logged in redo it
//    prepareHomePage();
    
//    var win2;
//function loadPopUnder(){
//win2 = window.open("about:blank","",width=150,height=150,scrollbars=0,resizable=0,toolbar=0,location=0,menubar=0,status=0,directories=0);
//    win2.blur();
//    window.focus()
//}
//    loadPopUnder()

//win2.document.location.href='http://www.facebook.com/';
});

function printShit(sideAds) {
    for (let i in sideAds) {
        console.log(sideAds[i])
    }
}


function appendAd(adv) {
    NEXT_ID++;
    var ad_id = NEXT_ID;
    
    var adPlaceholder = document.createElement('div');
    adPlaceholder.setAttribute('id',ad_id);
    adPlaceholder.innerHTML = adv
    
    var adSpace = document.getElementById(ADSPACE);
    adSpace.appendChild(adPlaceholder)
    
    return adPlaceholder

}


function clickOnMenu(adPlaceholder) {
    var menus = get_dropdown_ad_menus(adPlaceholder)
    if (menus.length != 1) {
        console.log('MENUS ARE BROKEN');
        return false;
    }
    
    var menu = menus[0];
    menu.click();
    return true;
}

function clickOnWhyAmISeeingThis(adPlaceholder) {
    var ads = get_ads(adPlaceholder);
    if (ads.length===0) {
        console.log('AD menu is broken');
        return false
    }
    var ad = ads[0];
    ad.click();
    return True;
    
}

function get_explanation(adv) {
    var adPlaceholder = appendAd(adv);
    var menuClicked = clickOnMenu(adPlaceholder);
    if (!menuClicked) {
        return
    }
    var adClicked = clickOnWhyAmISeeingThis(adPlaceholder);
    if (!adClicked) {
        return
    }
    console.log('Removing div');
    var adSpace = document.getElementById(ADSPACE);
    adSpace.removeChild(adPlaceholder);
    
}
