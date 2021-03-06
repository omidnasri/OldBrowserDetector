﻿jQuery.OldBrowsersDetector = function (configs) {

    var defaults = {
        // options : alert , redirect , message , modal
        mode: "alert",
        // message title in [ message , modal ] modes
        title: "",
        // content to show to user in [ alert , message , modal ] modes
        message: "",
        // links to borwsers in [ message , modal ] modes
        links: "",
        // ID of the HTML element to append message to , in  [ message ] mode
        container: "BrowserWarningMessage",
        // either to show a close button or not in , [ message , modal ] modes
        showCloseButton: false,
        // url to redirect user to , in [ redirect ] mode
        redirectToUrl: "",
        // browser versions to detect
        ieVersion: 8,
        firefoxVersion: 10,
        chromeVersion: 10,
        operaVersion: 9,
        safariVersion: 4
    };

    var configs = $.extend(defaults, configs);

    // check user setted browser versions
    CheckVersions();

    var userAgent = window.navigator.userAgent;

    // get browser name using it's userAgent
    var browserName = GetBrowserName(userAgent);

    // if browser is not one of 5 common ones( FF , MSIE , Opera , Chrome and Safari ) then do nothing
    if (browserName == "Others") {
        return;
    }

    // get user's browser version ( float parts will be ignored e.g 14.0.1 => 14 )
    var browserVersion = GetBrowserVersion(userAgent, browserName);

    //if browser version is not detected then do nothing
    if (browserVersion == "notFound" || isNaN(browserVersion)) {
        return;
    }

    if (IsBrowserOld(browserName, browserVersion)) {

        // check settings configured by user to fix errors
        checkConfigs();

        // [ alert ] mode : use Javascript alert method to notify user for his/her old browser
        if (configs.mode == "alert")
            alert(configs.message);
        // [ redirect ] mode : redirect user to another page
        else if (configs.mode == "redirect")
            window.location.href = configs.redirectToUrl;
        // [ message ] mode : show a message to user through an container element in the page
        else if (configs.mode == "message") {
            var closeBtn = "";
            if (configs.showCloseButton) {
                closeBtn = "<a id='closeOldBrowserWarningMessage' class='close-button' href='#' > close </a>";
            }

            $("#" + configs.container).hide().html(closeBtn + "<div id='messageContent'>" + CreateContent() + "</div>").fadeIn(1000);
        }
        // [ modal ] mode : show a modal window to user and disable all other elements on the page
        else if (configs.mode == "modal") {
            // wrapper dives
            var modalWindow = "<div id='BrowserWarningModal'><div id='modalWin'>";
            // close button
            if (configs.showCloseButton == true) {
                modalWindow += "<a id='closeOldBrowserWarningModal' class='close-button' href='#' > close </a>";
            }
            // message
            modalWindow += "<div id='modalContent'>" + CreateContent() + "</div>";
            modalWindow += "</div>";
            // a div to cover all page behind the modal window *
            modalWindow += "<div id='modalBg'></div></div>";

            // add to DOM
            $('body').append(modalWindow);
            // cover page with modal background div *
            setModalBgDimensions();
            // set modal window in the center of screen
            centeralizeModalWindow();

            // show modal background div
            $("#modalBg").fadeTo("slow", 0.5);


        }

        // add close buttons click event handlers
        //modal
        if (configs.showCloseButton == true) {

            var CloseBtnLink = $(".close-button");

            CloseBtnLink.click(function () {
                // hide the element that contains button
                $(this).parent().fadeOut();

                // hide modal background in modal mode
                if (configs.mode == "modal")
                    $("#modalBg").fadeOut();

                return false;
            });

        }


    }


    function GetBrowserName(userAgent) {

        var browserName = "Others";

        if (userAgent.indexOf("Firefox") != -1)
            browserName = "Firefox";
        else if (userAgent.indexOf("Opera") != -1)
            browserName = "Opera";
        else if (userAgent.indexOf("Chrome") != -1)
            browserName = "Chrome";
        else if (userAgent.indexOf("Safari") != -1)
            browserName = "Safari";
        else if (userAgent.indexOf("MSIE") != -1)
            browserName = "MSIE";

        return browserName;
    }


    function GetBrowserVersion(userAgent, browserName) {
        var version = "notFound";
        // start index to extract version from userAgent string
        var extVerFromIndex = 0;
        // end index to extract version from userAgent string
        var extVerToIndex = 0;

        // FireFox
        if (browserName == "Firefox") {
            extVerFromIndex = userAgent.lastIndexOf("/") + 1;
            version = userAgent.substring(extVerFromIndex);
        }
        // Opera
        else if (browserName == "Opera") {
            if (userAgent.indexOf("Version") != -1) {
                extVerFromIndex = userAgent.lastIndexOf("/") + 1;
                version = userAgent.substring(extVerFromIndex);
            }
            else {
                extVerFromIndex = userAgent.indexOf("Opera/") + 7;
                version = userAgent.substring(extVerFromIndex);
            }

        }
        // Chrome
        else if (browserName == "Chrome") {
            extVerFromIndex = userAgent.lastIndexOf("Chrome") + 7;

            version = userAgent.substring(extVerFromIndex);
            extVerToIndex = version.indexOf(".");
            version = version.substring(0, extVerToIndex);
        }
        // MSIE
        else if (browserName == "MSIE") {
            extVerFromIndex = userAgent.lastIndexOf("MSIE ") + 5;
            extVerToIndex = extVerFromIndex + 3;
            version = userAgent.substring(extVerFromIndex, extVerToIndex);
        }
        // Safari
        else if (browserName == "Safari") {
            if (userAgent.indexOf("Version") != -1) {
                extVerFromIndex = userAgent.lastIndexOf("Version") + 8;
                extVerToIndex = extVerFromIndex + 3;
                version = userAgent.substring(extVerFromIndex, extVerToIndex);
            }
            else {
                extVerFromIndex = userAgent.indexOf("Safari") + 7;
                extVerToIndex = extVerFromIndex + 3;
                version = userAgent.substring(extVerFromIndex, extVerToIndex);
            }
        }

        var dotIndex = version.indexOf(".");
        if (dotIndex != -1)
            version = version.substring(0, dotIndex);

        return version;
    }

    function IsBrowserOld(browserName, browserVersion) {
        var isOld = false;

        // convert version string into number for comparesion
        browserVersion = parseFloat(browserVersion);

        // Firefox
        if (browserName == "Firefox") {
            if (browserVersion <= configs.firefoxVersion)
                isOld = true;
        }
        // Opera
        else if (browserName == "Opera") {
            if (browserVersion <= configs.operaVersion)
                isOld = true;
        }
        // Chrome
        else if (browserName == "Chrome") {
            if (browserVersion <= configs.chromeVersion)
                isOld = true;
        }
        // MSIE
        if (browserName == "MSIE") {
            if (browserVersion <= configs.ieVersion)
                isOld = true;
        }
        // Safari
        if (browserName == "Safari") {
            if (browserVersion <= configs.safariVersion)
                isOld = true;
        }


        return isOld;

    }

    // set modal windows dimensions according to screen width and height
    function setModalBgDimensions() {
        var screenHeight = $(document).height();
        var screenWidth = $(window).width();
        $('#modalBg').css({ 'width': screenWidth, 'height': screenHeight });
    }

    // put modal window in center of screen 
    function centeralizeModalWindow() {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();

        $("#modalWin").css({ 'top': windowHeight / 2 - $("#modalWin").height() / 2 });
        $("#modalWin").css({ 'left': (windowWidth / 2) - ($("#modalWin").width() / 2) });
    }

    // checks and fixes missed or badly configured settings
    function checkConfigs() {

        // fix bad mode setting
        var modes = ["alert", "message", "modal", "redirect"];
        if ($.inArray(configs.mode, modes) == -1) {
            configs.mode = "alert";
        }

        // fix missed title
        if ($.trim(configs.title) == "") {
            configs.title = "هشدار";
        }

        // fix missed message
        if ($.trim(configs.message) == "") {

            if (configs.mode == "modal") {
                configs.message = ModalDefaultMessage();
            }
            else if (configs.mode == "message") {
                configs.message = MessageDefaultMessage();
            }
            else if (configs.mode == "alert") {
                configs.message = "مرورگر شما قدیمی و غیر ایمن است . لطفا آن را بروز کنید";
            }
        }

        // fix missed links
        if ($.trim(configs.links) == "") {
            configs.links = DefaultLinks();
        }

        // fix missed container for [ message ] mode
        if (configs.mode == "message" && $.trim(configs.container) == "") {
            configs.container = "BrowserWarningMessage";
        }
        if (configs.mode == "message" && $("#" + configs.container).length == 0) {
            $('body').prepend("<div id='" + configs.container + "'></div>");
        }

        // fix bad boolean as showCloseButton
        if (typeof configs.showCloseButton != "boolean") {
            configs.showCloseButton = true;
        }

        // change to [ alert ] mode if [ redirect ] mode url is missed
        if (configs.mode == "redirect" && $.trim(configs.redirectToUrl) == "") {
            configs.mode = "alert";
        }

    }


    function CheckVersions() {

        // fix bad browser versions setting
        if (isNaN(parseFloat(configs.ieVersion))) {
            configs.ieVersion = 8;
        }

        if (isNaN(parseFloat(configs.firefoxVersion))) {
            configs.firefoxVersion = 10;
        }

        if (isNaN(parseFloat(configs.operaVersion))) {
            configs.operaVersion = 9;
        }

        if (isNaN(parseFloat(configs.chromeVersion))) {
            configs.chromeVersion = 10;
        }

        if (isNaN(parseFloat(configs.safariVersion))) {
            configs.safariVersion = 4;
        }

    }


    // default content
    function ModalDefaultMessage() {
        var content = "برای اینکه بتوانید تجربه بهتری در اینترنت داشته باشید و از امکانات مدرن وب سایتها استفاده کنید پیشنهاد میکنیم یکی از مرورگرهایی که در لیست زیر آمده است را دانلود کنید. متاسفانه این وب سایت با مرورگر شما سازگاری ندارد.";
        content += "کافی است بر روی آیکانهای آنها کلیک کنید تا به وب سایت مربوطه منتقل شوید.";
        return content;
    }

    function MessageDefaultMessage() {
        var content = " متاسفانه این وب سایت با مرورگر شما سازگاری ندارد. برای اینکه از امکانات مدرن وب سایتها استفاده کنید یکی از مرورگرهایی که در لیست روبرو آمده است را دانلود کنید..";
        content += "کافی است بر روی آیکانهای آنها کلیک کنید تا به وب سایت مربوطه منتقل شوید.";
        return content;
    }

    // default links
    function DefaultLinks() {

        var links = "<ul class='browser-options'>";
        links += "<li class='firefox'><a href='http://mozilla.com/firefox/'></a></li>";
        links += "<li class='chrome'><a href='http://google.com/chrome'></a></li>";
        links += "<li class='opera'><a href='http://opera.com'></a></li>";
        links += "<li class='ie'><a href='http://microsoft.com/ie'></a></li>";
        links += "<li class='safari'><a href='http://apple.com/safari'></a></li>";
        links += "</ul>";

        return links;

    }


    function CreateContent() {

        var content = "<h2>" + configs.title + "</h2>";
        content += "<div class='message'>" + configs.message + "</div>";
        content += "<div class='links'>" + configs.links + "</div>";
        return content;
    }

}