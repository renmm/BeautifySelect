var langData=new Hashtable();

//cn,en,big5
langData.add('000537c5c7ba18408b2d85f2c5ee805d',[
'登录使用',
'Sign in ',
'登錄使用',
'',
''
]);
langData.add('ff9485a17f5a054916dbff60834f7733',[
'密&nbsp;&nbsp;码',
'Password',
'密&nbsp;&nbsp;碼',
'',
''
]);
langData.add('fee70b6d6d61ff476964f3f6737e6aea',[
'用户名',
'UserName',
'用戶名',
'',
''
]);
langData.add('fee70b6d6d61ff4d7422f09cf894bb25',[
'登录',
'Login',
'登錄',
'',
''
]);
langData.add('fee70b6d6d61ff47139f7ef41dda7711',[
'Actionsoft Co.Ltd 炎黄盈动版权所有',
'Actionsoft Co.Ltd Actionsoft All Rights Reserved',
'Actionsoft Co.Ltd 炎黃盈動版權所有',
'',
''
]);
//获取用户语言
function getLanguage(key){
	var data=langData.items(key);
	if(data==null)return key;
	//cn,en,big5
	var lang=getPortalLang();
	if(lang=='cn')return data[0];
	if(lang=='en')return data[1];
	if(lang=='big5')return data[2];
	return data[0];
}

	
//判断浏览器使用的语言
function getPortalLang(){
 var lang=getLangCookie('portal_lang');
 if(lang!=null && lang.length>0)return lang;
 if (navigator.appName=='Netscape'){   
  var language=navigator.language;}   
  else   {
  var language=navigator.browserLanguage;   }
 if(language.indexOf('en')>-1)return 'en';
 if(language=='zh-TW' || language=='zh-HK')return 'big5';
 if(language.indexOf('zh')>-1)return 'cn';
 if(language.indexOf('ja')>-1)return 'en';
 if(language.indexOf('de')>-1)return 'en';
 if(language.indexOf('fr')>-1)return 'en';
 if(language.indexOf('it')>-1)return 'en';
 return 'en';    
}


function getLangCookie (cookieName) {
	var cookieValue = '';
	var posName = document.cookie.indexOf(escape(cookieName) + '=');
	if (posName != -1) {
		var posValue = posName + (escape(cookieName) + '=').length;
		var endPos = document.cookie.indexOf(';', posValue);
		if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
		else cookieValue = unescape(document.cookie.substring(posValue));
	}
	if(cookieValue=='')return null;
	return (cookieValue);
}
/**
设置Cookie
*/
function SetCookie (cookieName, cookieValue, expires, path, domain, secure) {
var Days = 30;
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
document.cookie = cookieName + "="+ escape (cookieValue) + ";expires=" + exp.toGMTString();
} 
function setCoeLangCookie(lang){
  pathname = location.pathname;
  myDomain = pathname.substring(0,pathname.lastIndexOf('/')) +'/';
  var largeExpDate = new Date ();
  largeExpDate.setTime(largeExpDate.getTime() + (365 * 24 * 3600 * 1000));
	SetCookie('portal_lang',document.getElementById("AWSINAdministrator").PORTAL_LANG.value,largeExpDate,myDomain);	
	try{
		document.title=getLanguage('fee70b6d6d61ff4754f85afc6c63eb11'); 
		document.getElementById("awsCopyRight").innerHTML=getLanguage('fee70b6d6d61ff47139f7ef41dda7711'); 
		document.getElementById("showProcessTitle").innerText=getLanguage('fee70b6d6d61ff476bbc297df77c8371');
	}catch(e){}
}
function Hashtable()
{
    this._hash= new Object();
    this.add= function(key,value){
        if(typeof(key)!="undefined"){
            if(this.contains(key)==false){
                this._hash[key]=typeof(value)=="undefined"?null:value;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    this.remove  = function(key){delete this._hash[key];}
    this.count = function(){var i=0;for(var k in this._hash){i++;} return i;}
    this.items = function(key){return this._hash[key];}
    this.contains = function(key){ return typeof(this._hash[key])!="undefined";}
    this.clear = function(){for(var k in this._hash){delete this._hash[k];}}
}

 function inCOE(){
 	return false; 	

}

function onFocus(){
	document.AWSINAdministrator.userid.focus();
	lang=getPortalLang();
 	document.AWSINAdministrator.PORTAL_LANG.value=lang;	 	
}
function loadLang(){
	
 	document.getElementById('PORTAL_LANG').value=getPortalLang();
 	jQuery("select#PORTAL_LANG option").removeAttr("selected");
 	jQuery("#PORTAL_LANG option[value="+getPortalLang()+"]").attr("selected","selected");
	document.getElementById('userid').focus();
	try{
	document.getElementById('sign').innerHTML=getLanguage('000537c5c7ba18408b2d85f2c5ee805d');
	document.getElementById('uidDiv').innerHTML=getLanguage('fee70b6d6d61ff476964f3f6737e6aea');
	document.getElementById('pwdDiv').innerHTML=getLanguage('ff9485a17f5a054916dbff60834f7733');
	document.getElementById('loginCommand').innerHTML=getLanguage('fee70b6d6d61ff4d7422f09cf894bb25');
	document.getElementById('awsCopyRight').innerHTML=getLanguage('fee70b6d6d61ff47139f7ef41dda7711');
}catch(e){}
}