//constants
var LINK_TAG = 'a';
var AD_LINK = '/ads/preferences/dialog/?ad_id=';
var AJAXIFY = 'ajaxify';
var EXPLANATION_TEXT = ["Why am I seeing this?","Pourquoi est-ce que je vois ça ?"];
var SPLIT_AD_URL = '&';
var MENU_LABEL = ["Report or learn more","Signaler ou en savoir plus"];
var ARIA_LABEL = "aria-label";
var DATA_GT = 'data-gt';
var DATA_TO_LOG = 'data_to_log';
var AD_ID = 'ad_id';
var AD_ACCOUNT_ID = 'ad_account_id';
var OK = 'OK';
var NOT_OK = 'NOT_OK';
var SPONSORED = ['Sponsored','Sponsorisé'];
var FRONT_AD_COUNT = 17;
var NOT_FRONT_AD = 'adsCategoryTitleLink';
var CLASS = 'class';
var MORE_LINK_FRONT_LABEL = ['Story options','Options des actualités'];
var FRONTAD_OVERLAY = 'uiContextualLayerPositioner uiLayer';
var COLLECTED = 'ad_collected';
var TYPES = {"frontAd" : "frontAd", "sideAd" : "sideAd"};
var ONMOUSEOVER = 'onmouseover';
var ONMOUSEDOWN= 'onmousedown';
var SWAPINGFUNCTION = /"[\s\S]*"/;
var LINKSHIMASYNCLINK = 'LinkshimAsyncLink';
var LINKSEPARATOR = "|||";
//var "USER_ID":"682079774"
var USER_ID_TAG = /"USER_ID":"[0-9][0-9]+"/;
var NUMBER_TAG = /[0-9]+/;
var HYPERFEED_STORY = 'hyperfeed_story_id';
var DOM_AD = 'domAD';
var DATA_HOVERCARD = 'data-hovercard';
var ADVERTISER_FB_ID_PATTERN = '/ajax/hovercard/page.php?id=';
var FT_ENT_IDENTIFIER = 'ft_ent_identifier';
var INPUT = 'input';
var VALUE = 'value';
var NAME = 'name';
var STYLE = 'style';
var CONTENT_AREA = 'contentArea';
var FRONTADPOSTPATTERN = /feedback_target_id%5C%5C%5C%22%3A[0-9]+/;
var FRONTADPOSTPATTERNSTRING = "feedback_target_id%5C%5C%5C%22%3A";
// AI%5C%5C%5C%5Cu00402b9e91e556cbef0ac6d58f6d4b30127b%5C
var FRONTADPOSTPATTERN2 = /AI%5C%5C%5C%5Cu00[a-z0-9]+%5C/
var FRONTADPOSTPATTERNSTRING2a = "AI%5C%5C%5C%5Cu00"
var FRONTADPOSTPATTERNSTRING2b = "%5C"
var FRONTADPOSTPATTERN3= /%22qid%22%3A%22[0-9]+%22/
var FRONTADPOSTPATTERNSTRING3a = "%22qid%22%3A%22"
var FRONTADPOSTPATTERNSTRING3b = "%22"

var ADVERTISER_ID_PATTERN_IDENTIFIER = /id=?[0-9]+/



//var URL_REGEXP = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var URL_REGEXP= /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}/

///"background-image: url(https://scontent.xx.fbcdn.net/v/t15.0-10/p480x480/17621064_1769517093062117_5270720042437181440_n.jpg?oh=c6831f7394bb102f943e26ea541b167c&oe=595B080B);"


//LinkshimAsyncLink.swap(this, "http:\/\/www.asos.de\/herren\/entdecken\/denim\/?affid=17593");



var AJAXIFYPATTERNSIDEAD= /"\\\/ads\\\/preferences\\\/dialog\S+?"/
var ADIDPATTERN = /id=[0-9]+/;


function isNumeric(value) {
    return /^\d+$/.test(value);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

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



Array.prototype.unique = function unique() {
        var self = this;
        return self.filter(function(a) {
            var that = this;
//            console.log(that);
//            console.log(a)
//            console.log(that[a])
            return !that[a] ? that[a] = true : false;
        },{});}


Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);    
}


function setDiff(a,b) {
    return new Set(
        [...a].filter(x => !b.has(x)));

}

function getSetOfKeys(obj) {
    return new Set(Object.keys(obj))
}


function getNewAds(oldAds,newAds) {
    
    var oldIds = getSetOfKeys(oldAds);
    var newIds = getSetOfKeys(newAds);
    
    var onlyNewIds = setDiff(newIds,oldIds);
    var adsToSend = {}
    for (let i of onlyNewIds) {
        adsToSend[i] = newAds[i];
    }
    return adsToSend
}

function extract_ad_id(ajaxify){
//    slice the first part of the url
    var sliced_url = ajaxify.slice(ajaxify.indexOf(AD_LINK)+AD_LINK.length,ajaxify.length);
   return sliced_url.split(SPLIT_AD_URL)[0]
     
}



function grabParamsFromSideAdAjaxify(resp) {
    try {
        var text = resp.replaceAll('\\\\\\','\\').replaceAll('\\\\','\\').replaceAll('amp;','');
        var requestParams = text.match(AJAXIFYPATTERNSIDEAD)[0].replace('"\\\/ads\\\/preferences\\\/dialog\\\/?','');
                
        requestParams = requestParams.slice(0,requestParams.length-2);
        var adId = requestParams.match(ADIDPATTERN)[0].match(NUMBER_TAG)[0];
        return {requestParams:requestParams,adId:adId}
        
    } catch (exp) {
        console.log('Exception in grabParamsFromSideAdAjaxify');
        console.log(exp);
    }
    return NaN
    
    
}

function get_dropdown_ad_menus(doc){
        var links = doc.getElementsByTagName(LINK_TAG);
    var menus = [];
        for (var i=0;i<links.length;i++){
            var link = links[i];
        var menuLabel = link.getAttribute(ARIA_LABEL);
            if ((menuLabel) && (MENU_LABEL.indexOf(menuLabel)>=0)) {
                menus.push(link)
            }
        }
    return menus
    
}


function getSideAds() {
    var ads = {};
    var menus = get_dropdown_ad_menus(document);
    for (var i=0;i<menus.length;i++) {
        var menu = menus[i]
//        putting quotes in numbers because of javascript mismanagement of bigints
        if (filterCollectedAds([menu.parentElement.parentElement.parentElement]).length==0) {
            continue
        }
        var adId = JSON.parse(menu.getAttribute(DATA_GT).replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3"))[DATA_TO_LOG][AD_ID].toString()
        var advertiserId = JSON.parse(menu.getAttribute(DATA_GT).replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3"))[DATA_TO_LOG] [AD_ACCOUNT_ID].toString();
        var isCollected = false;
       
       

        ads[adId] ={};
        ads[adId][DOM_AD] =menu.parentElement.parentElement.parentElement;
        ads[adId][AD_ACCOUNT_ID] = advertiserId;
    }
    
    return ads
}

function isHidden(el) {
    return (el.offsetParent === null)
}


function isScrolledIntoView(elem)
{
    if (isHidden(elem)){
        return false
    }
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}


function filterFrontAds(lst) {
    var newLst = [];
    for (var i=0;i<lst.length;i++) {
        if ((SPONSORED.indexOf(lst[i].text)>=0 ) && (lst[i].getAttribute(CLASS)) &&  (lst[i].getAttribute(CLASS).indexOf(NOT_FRONT_AD)===-1) && (isScrolledIntoView(lst[i]))) {
            newLst.push(lst[i])

        }
        
                    if ((SPONSORED.indexOf(lst[i].text)>=0 ) && (lst[i].getAttribute(CLASS)) &&  (lst[i].getAttribute(CLASS).indexOf(NOT_FRONT_AD)===-1) && (!isScrolledIntoView(lst[i]))){
                console.log(lst[i])
                            console.log('*****************HIDDEN*************');

            }
    }
    
    return newLst
}



//function getParentAdDiv(elem) {
//    if (count===0) {
//        return elem;
//    }
//    return getParentNode(elem.parentElement,count-1);
//}
function getParentAdDiv(elem) {
    if ((elem.id.length>0) && (elem.id.indexOf(HYPERFEED_STORY)!==-1)){
        return elem;
    }
    return getParentAdDiv(elem.parentElement);
}


function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}



function filterCollectedAds(ads) {
    var filteredAds = [];
    for (let i=0;i<ads.length;i++) {
        let ad = ads[i];
        if (ad.className.indexOf(COLLECTED)!=-1) {
            continue
        }
        filteredAds.push(ad);
    }
    return filteredAds;
}


function getFrontAdFrames() {
    
    var links = document.getElementsByTagName(LINK_TAG);
    links = filterFrontAds(links);
//    console.log(links)
    var frontAds = [];
    for (var i=0;i<links.length;i++) {
        var link = links[i];
        var frame = getParentAdDiv(link);
//        TODO: placeholder if the ad was loaded
        frontAds.push(frame);    
    }
//    frontAds = frontAds.unique();
    return filterCollectedAds(frontAds);
    
    
}

function getLandingPagesFrontAds(links,frontAd) {
    var landingPages = [];
    var images = []
    for (let i=0;i<links.length;i++) {
        let link = links[i];
        let onmouseover= link.getAttribute(ONMOUSEOVER);
        if (!onmouseover) {
            continue
        }
        
        let imgs = link.getElementsByTagName('img');
        if (imgs.length>0) {
            for (let j=0;j<imgs.length;j++) {
                if (imgs[j].src) {
                    images.push(imgs[j].src)   
                    continue
                }
                    console.log(imgs[j])
            }
        }
        if ( (onmouseover.indexOf(LINKSHIMASYNCLINK)===-1)) {
            continue
        }
        
        
        let urls = onmouseover.match(SWAPINGFUNCTION);
        if (!urls) {
            continue
        }
        
        
        landingPages.extend(urls);
        
    }
    
    
        var additionalImages = frontAd.getElementsByClassName('scaledImageFitWidth');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    
        var additionalImages = frontAd.getElementsByClassName('scaledImageFitHeight');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    
    
                var additionalImages = frontAd.getElementsByClassName('_kvn img');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    
    return [landingPages.unique(),images.unique()];
}
    
function getLandingPagesSideAds(links,sideAd) {
    var landingPages = [];
    var images = []
    for (let i=0;i<links.length;i++) {
        let link = links[i];
        let onmousedown= link.getAttribute(ONMOUSEDOWN);
        if (!onmousedown) {
            continue
        }
        
        let imgs = link.getElementsByTagName('img');
        if (imgs.length>0) {
            for (let j=0;j<imgs.length;j++) {
                if (imgs[j].src) {
                    images.push(imgs[j].src)   
                    continue
                }
                    console.log(imgs[j])
            }
        }
    
        
        
        let urls = [link.href]
        if (!urls) {
            continue
        }
        
        
        landingPages.extend(urls);
        
    }
    
    var additionalImages = sideAd.getElementsByClassName('scaledImageFitWidth');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    
        var additionalImages = sideAd.getElementsByClassName('scaledImageFitHeight');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    

                var additionalImages = sideAd.getElementsByClassName('_kvn img');
//    console.log(additionalImages)
    for (let i=0;i<additionalImages.length;i++) {
        images.push(additionalImages[i].src);

    }
    
    
    return [landingPages.unique(),images.unique()];

}
var ADSA

function getImageUrls(images) {
    var urls = []
    for (let i=0;i<images.length;i++) {
        let src = images[i].src
        if ((src) && (src.length>0)) {
            urls.push(src)
        }
    }
    return urls
}


function getAdvertiserId(frontAd) {
    let links = frontAd.getElementsByTagName(LINK_TAG);
    let link = null
    for  (let i=0;i<links.length;i++) {
        if (links[i].hasAttribute(DATA_HOVERCARD) && (links[i].getElementsByTagName('img').length>0)) {
            link = links[i];
            break
        }
    }
    
    if (!link) {
        return 
    }
    
//    let advertiserId = link.getAttribute(DATA_HOVERCARD).replace(ADVERTISER_FB_ID_PATTERN,"")
    var advertiserId = '-1';
    try {
         let hovercard = link.getAttribute(DATA_HOVERCARD)
//    var urlad = new URL(hovercard);
         advertiserId = hovercard.match(ADVERTISER_ID_PATTERN_IDENTIFIER)[0].match(NUMBER_TAG)[0]
//     advertiserId= urlad.searchParams.get("id");
    if (!isNumeric(advertiserId)) {
        advertiserId ='-1';
    }
        
    } catch (e) {
        console.log(e)
    }
   
    let facebookPage = link.href.substring(0, link.href.indexOf('?'));
    let advertiserImage = link.getElementsByTagName('img')[0].src
    return [advertiserId,facebookPage,advertiserImage]
    
}

function isVideo(frontAd) {
    return frontAd.getElementsByTagName('video').length>0
}


function getVideoId(frontAd) {
    let videoId=null;
    inputs = frontAd.getElementsByTagName(INPUT);
    for (let i=0;i<inputs.length;i++) {
        if (inputs[i].getAttribute(NAME) === FT_ENT_IDENTIFIER) {
            videoId = inputs[i].getAttribute(VALUE)
        }
    }
    return videoId
}

function getBackgroundUrlImages(frontAd) {
    let imgs = frontAd.getElementsByTagName('img');
    let images = [];
    for (let i=0;i<imgs.length;i++) {
        let img = imgs[i]
        if (img.getAttribute(STYLE)) {
            var url = img.getAttribute(STYLE).match(URL_REGEXP);
            if ((url) && (url.length>0)) {
                images.push(url[0].substring(0,url[0].length-2));
            }
        }
    }
    return images
    
}





function processFrontAd(frontAd) {
     
    frontAd.className += " " + COLLECTED;
    console.log(frontAd)
    ADSA = frontAd
    let info =  getAdvertiserId(frontAd);
    
    var advertiser_facebook_id = info?info[0]:"";
    var advertiser_facebook_page = info?info[1]:"";
    var advertiser_facebook_profile_pic = info?info[2]:"";
    
    var raw_ad = frontAd.innerHTML;
    var timestamp = (new Date).getTime();
    var pos = getPos(frontAd);
    var offsetX = pos.x;
    var offsetY = pos.y;
    var type = TYPES.frontAd;
    var [landing_pages,images] = getLandingPagesFrontAds(frontAd.getElementsByTagName(LINK_TAG),frontAd);
    var video = isVideo(frontAd)
    var video_id = ''
    if (video) {
        video_id = getVideoId(frontAd);
        images = getBackgroundUrlImages(frontAd);
        
    }
    
    //TODO:GET IMAGE URL
//    var image_urls = getImageUrls(frontAd.getElementsByTagName('img'));
    
//       fb_id = 
//    fb_advertiser_id = 
    var user_id = getUserId();
    return {'raw_ad':raw_ad,'timestamp':timestamp,'offsetX':offsetX,'offsetY':offsetY,'type':type,'landing_pages':landing_pages,'images':images,'user_id':user_id,advertiser_facebook_id:advertiser_facebook_id,advertiser_facebook_page:advertiser_facebook_page,advertiser_facebook_profile_pic:advertiser_facebook_profile_pic,video:video,video_id:video_id}
    
    
}



function processSideAd(sideAdObj,adId) {
     
//    frontAd.className += " " + COLLECTED;
//    console.log(frontAd)
//    ADSA = frontAd

    var sideAd = sideAdObj[DOM_AD];
    sideAd.className += " " + COLLECTED;

    var raw_ad = sideAd.innerHTML;
    var timestamp = (new Date()).getTime();
    var pos = getPos(sideAd);
    var offsetX = pos.x;
    var offsetY = pos.y;
    var type = TYPES.sideAd;
    var [landing_pages,images] = getLandingPagesSideAds(sideAd.getElementsByTagName(LINK_TAG),sideAd);
    
    //TODO:GET IMAGE URL
//    var image_url = 
    var fb_id = adId;
    var fb_advertiser_id = sideAdObj[AD_ACCOUNT_ID];
//    console.log(fb_advertiser_id);
    var user_id = getUserId();
    return {'raw_ad':raw_ad,'timestamp':timestamp,'offsetX':offsetX,'offsetY':offsetY,'type':type,'user_id':user_id,'fb_id':fb_id,'fb_advertiser_id':fb_advertiser_id,landing_pages:landing_pages,images:images}
    
    
}


function getMoreButtonFrontAd(adFrame) {
    var links = adFrame.getElementsByTagName(LINK_TAG);
    for (var i=0;i<links.length;i++) {
        if (MORE_LINK_FRONT_LABEL.indexOf(links[i].getAttribute(ARIA_LABEL))>=0) {
            return links[i]
        }
    }
    
    
    
}



function getExplanationButtonFrontAd(adFrame) {
    var mainWindow = document

    var links = mainWindow.getElementsByTagName('a')
    for (let i=0;i<links.length;i++) {
        let link = links[i];
        let ajaxify = link.getAttribute(AJAXIFY);
        if ((ajaxify) && (ajaxify.indexOf(AD_LINK) != -1) && (link.text) && (EXPLANATION_TEXT.indexOf(link.text)>=0)) {
            var ad_id = extract_ad_id(ajaxify)
            var postPattern = ajaxify.match(FRONTADPOSTPATTERN);
            if ((postPattern )&& (postPattern.length>0)) {
                 var postId = postPattern[0].replace(FRONTADPOSTPATTERNSTRING,'')
                if (adFrame.innerHTML.indexOf('value="'+postId)!=-1) {
                return [ad_id,link]
            }
                
            }
            postPattern = ajaxify.match(FRONTADPOSTPATTERN2);

//        
//            if ((!postPattern) || (postPattern.length==0)) {
////                console.log(ajaxify)
//                continue;
//            }
              if ((postPattern )&& (postPattern.length>0)) {
             var postId2 = postPattern[0].replace(FRONTADPOSTPATTERNSTRING2a,'').replace(FRONTADPOSTPATTERNSTRING2b,'')
                if (adFrame.innerHTML.indexOf(postId2)!=-1) {
                return [ad_id,link]
                }
                  }
            
            
                        postPattern = ajaxify.match(FRONTADPOSTPATTERN3);

//        
//            if ((!postPattern) || (postPattern.length==0)) {
////                console.log(ajaxify)
//                continue;
//            }
              if ((postPattern )&& (postPattern.length>0)) {
             var postId2 = postPattern[0].replace(FRONTADPOSTPATTERNSTRING3a,'').replace(FRONTADPOSTPATTERNSTRING3b,'')
                if (adFrame.innerHTML.indexOf(postId2)!=-1) {
                return [ad_id,link]
                }
                  }
            
        }   
        
    }
    return [false,false];
} 

//function getFrontAdExplanationLink(adFrame) {
//    
//    var moreButton =  getMoreButtonFrontAd(adFrame);
//    var buttonId = moreButton.parentElement.id;
//    moreButton.click();
//    moreButton.click();
////    var adLinks = get_ads(adFrame);
//    var count = 10;
////    var overlay = document.getElementsByClassName(FRONTAD_OVERLAY);
//    while (count>0) {
//        var [adId,adLink]  = getExplanationButtonFrontAd(adFrame);
//        if (adId!=false) {
//            return [adId,adLink,buttonId]
//        }
//        count--;
//    }
//    
//    return [false,false,buttonId];
//    
//    
//
//    
//}


//
//function getFrontAdExplanationLink(adFrame) {
//    
//    var moreButton =  getMoreButtonFrontAd(adFrame);
//    
//    var buttonId = moreButton.parentElement.id;
//    
//    
////    var adLinks = get_ads(adFrame);
//    var count = 10;
////    var overlay = document.getElementsByClassName(FRONTAD_OVERLAY);
//    while (count>0) {
//        var [adId,adLink]  = getExplanationButtonFrontAd(adFrame);
//        if (adId!=false) {
//            return [button]
//        }
//        count--;
//    }
//    
//    return [false,false];
//    
//    
//
//    
//}


//Returns the button id that is going to be used for identifying the explanation link when we hover over
function getButtonId(adFrame) {
    var moreButton = getMoreButtonFrontAd(adFrame);
    return moreButton.parentElement.id;
}


function hoverOverButton(adFrame) {
    
    var moreButton = getMoreButtonFrontAd(adFrame);
    moreButton.dispatchEvent(new MouseEvent('mouseover'));
}



function strip(html)
{
   var tmp = document.createElement("DIV");
    
   tmp.innerHTML = html.replace(/\\u003c/gi,"<").replaceAll('\\','');
    
    var txt = '';
    
    for (var i =0;i<tmp.childNodes.length;i++) {
        txt +='. ' + tmp.childNodes[i].textContent || tmp.childNodes[i].innerText || ""
    }
    
   return txt ;
}




function getAds(doc) {
    
    var links = doc.getElementsByTagName(LINK_TAG);
//    MAYBE SAME AD APPEARS MORE THAN ONCE?
    var ad_links = {};
    for (var i=0;i<links.length;i++){
        var link = links[i];
        var ajaxify = link.getAttribute(AJAXIFY);
        if ((ajaxify) && (ajaxify.indexOf(AD_LINK) != -1) && (link.text) && (EXPLANATION_TEXT.indexOf(link.text)>=0)) {
            var ad_id = extract_ad_id(ajaxify)
            ad_links[ad_id] = link
        }   
    }
    return ad_links;  
    
}



var createObjFromURI = function(params) {
    var uri = decodeURI(params);
    var chunks = uri.split('&');
    var params = Object();

    for (var i=0; i < chunks.length ; i++) {
        var chunk = chunks[i].split('=');
        if(chunk[0].search("\\[\\]") !== -1) {
            if( typeof params[chunk[0]] === 'undefined' ) {
                params[chunk[0]] = decodeURIComponent([chunk[1]]);

            } else {
                params[chunk[0]].push(decodeURIComponent(chunk[1]));
            }


        } else {
            params[chunk[0]] = decodeURIComponent(chunk[1]);
        }
    }

    return params;
}


