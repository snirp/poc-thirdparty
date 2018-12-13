
let braincards = (function(window, undefined){
  
  let braincards = {};

  function loadScript(url, callback, integrity=undefined, crossOrigin='anonymous') {
    const script = document.createElement('script');
    script.async = true;
    script.src = url;
    script.onload = function() { callback() };
    if(integrity) script.integrity = integrity;
    script.crossOrigin = crossOrigin;
    // TODO optimize: query once outside fuction
    const entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);
  }

  /**
   * Locate the script tag that loads this script
   * return the element, and all params (including site-name)
   */
  function getEntryElementAndShortName(){
    const scripts = document.body.getElementsByTagName('script');
    let element, src, matches;
    const siteRegex = /http:\/\/127\.0\.0\.1:8080\/([a-zA-Z0-9-]+)\/widget\.js/

    for (element of scripts) {
      src = element.src;
      if (src) {
        matches = src.match(siteRegex)
        if (matches) {
          return [matches[1], element];
        }
      }
    }
    return null;
  }

  function loadSupportingFiles(callback) {
    console.log("testing2")
    loadScript(
      'https://code.jquery.com/jquery-3.3.1.min.js', 
      function(){ $( "h1" ).css( "border", "9px solid red" ); },
      'sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=')
  }

  function getWidgetParams() {}
  function getCardData(params, callback) {}
  function drawWidget() {}

  loadSupportingFiles(function() {
    const params  = getWidgetParams();
    getCardData(params, function() {
      drawWidget();
    });
  });

  getEntryElementAndShortName()

  return braincards;
})();

