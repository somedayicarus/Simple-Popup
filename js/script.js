/*\
|*|  :: cookies.js ::
|*|  A complete cookies reader/writer framework with full unicode support.
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
\*/

var docCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
            case Number:
                sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                break;
            case String:
                sExpires = "; expires=" + vEnd;
                break;
            case Date:
                sExpires = "; expires=" + vEnd.toUTCString();
                break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {   
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

//get & set cookies with 24 hour expiration
numCookies = docCookies.getItem('popup');
if(numCookies == null) {
    numCookies = 0;
} else {
    numCookies = parseInt(numCookies, 10);
}
numCookies++;
docCookies.setItem('popup', (numCookies).toString(10), 86400)

//popup that loads on 1st and 2nd pageviews per 24 hours
$(document).ready(function () {

    var popWin = '.window';
    var maskHeight = $(document).height();

    if (numCookies <= 10) {
        $('#mask').css({'width': '100%', 'height': maskHeight});
        $('#mask').fadeTo(800, 0.6);

//function for centering window
    jQuery.fn.center = function() {
        var winH = $(window).height();
        var winW = $(window).width();
        this.css('top', winH / 2 - $(this).outerHeight() / 2);
        this.css('left', winW / 2 - $(this).outerWidth() / 2);
        return this;
    }
//set the popup window to center
    $(popWin).center();
    $(window).resize(function() {
        $(popWin).center();
    })
    
    $(popWin).fadeIn(700);
        
//close
    $('.window .close').click(function (e) {
        e.preventDefault();
        $('#mask').hide();
        $('.window').hide();
    });
    
    $('#mask').click(function () {
        $(this).hide();
        $('.window').hide();
    });
    
    };
});
