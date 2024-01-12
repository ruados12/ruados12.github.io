const rand = function (min, max) {
    return ~~(Math.random() * (max - min + 1)) + min;
};
const randFloat = function(min, max) {
    return (Math.random() * (max - min + 1)) + min;
}
//forEach script
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(str) {
		if (this.length < str.length) { return false; }
		return this.indexOf(str) == 0;
	}
}
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(str) {
		if (this.length < str.length) { return false; }
		return this.lastIndexOf(str) + str.length == this.length;
	}
}
if(!String.prototype.substr) {
    String.prototype.substr = function(substr) {
        return function(start, length) {
            // call the original method
            return substr.call(this,
                // did we get a negative start, calculate how much it is from the beginning of the string
                // adjust the start parameter for negative value
                start < 0 ? this.length + start : start,
                length
            )
        }
    };
}
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('after')) {
        return;
        }
        Object.defineProperty(item, 'after', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function after() {
            var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();
    
            argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
            });
    
            this.parentNode.insertBefore(docFrag, this.nextElementSibling);
        }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

const agent = navigator.userAgent.toLowerCase();
let isIe = false;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

const responsive = {
    'pcOnly'  : window.matchMedia("(min-width: 1025px)").matches,
    'tabOnly' : window.matchMedia("(min-width: 801px) and (max-width: 1024px)").matches,
    'tab'     : window.matchMedia("(max-width: 1280px)").matches,
    'tabS'    : window.matchMedia("(max-width: 1024px)").matches,
    'mob'     : window.matchMedia("(max-width: 800px)").matches
}

function responsiveEvt(_matchMedia){
	return  window.matchMedia(_matchMedia).matches;
}

if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
    isIe = true;
}

// IE
if(isIe) {
	window.MSInputMethodContext && document.documentMode && document.write('<script src="https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js"><\/script>');
	function vhMax (){
		var vh = window.innerHeight * 0.01
		document.documentElement.style.setProperty('--vh', vh + 'px');
	}
	vhMax();

    function vwMax (){
		var vw = window.innerWidth * 0.01
		document.documentElement.style.setProperty('--vw', vw + 'px');
	}
	vwMax();
}


let wid = window.innerWidth;
let hei = window.innerHeight;

window.addEventListener('resize', throttle(function() {
    wid = window.innerWidth;
    hei = window.innerHeight;
    // Mobile
    if(isMobile && !isIe){
    	function vhMax (){
    		var vh = window.innerHeight * 0.01
    		document.documentElement.style.setProperty('--vh', vh + 'px');
    	}
    	vhMax();

        function vwMax (){
    		var vw = window.innerWidth * 0.01
    		document.documentElement.style.setProperty('--vw', vw + 'px');
    	}
    	vwMax();
    }
    // IE
    if(isIe) {
    	window.MSInputMethodContext && document.documentMode && document.write('<script src="https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js"><\/script>');
    	function vhMax (){
    		var vh = window.innerHeight * 0.01
    		document.documentElement.style.setProperty('--vh', vh + 'px');
    	}
    	vhMax();

        function vwMax (){
    		var vw = window.innerWidth * 0.01
    		document.documentElement.style.setProperty('--vw', vw + 'px');
    	}
    	vwMax();
    }
}, 300));


// 넘어온 값이 빈값인지 체크
function isEmpty(value){
	if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
		return true;
	}else{
		return false;
	}
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function onEnter(el) {
    if(event.keyCode == 13) {
        $('['+$(event.target).attr('data-active')+']').click();
    }
}


function throttle(func, milliseconds) {
    var throttleCheck;
    return function () {
        var context = this, args = arguments;
        if (!throttleCheck) {
        throttleCheck = setTimeout(function() {
            func.apply(context, args);
            throttleCheck = false;
        }, milliseconds);
        }
    };
};

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};