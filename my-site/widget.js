
let braincards = (function(window, undefined){
  
  let braincards = {};
  let iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height= "0";  // Set a low initial height, as resizer doesn't handle it properly

  function loadScript(url, integrity=undefined, callback=undefined) {
    const script = document.createElement('script');
    script.async = true;
    script.src = url;
    script.onload = function() { callback() };
    if(integrity) {
      script.integrity = integrity;
      script.crossOrigin = 'anonymous';
    }
    // TODO optimize: query once outside fuction
    const entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);
  }

  /**
   * Locate the script tag that loads this script
   * return the element, and all params (including site-name)
   */
  function getElementAndParams(){
    const params = braincard_config  // TODO security: trusting the user input here
    const scripts = document.body.getElementsByTagName('script');
    const siteRegex = /http:\/\/127\.0\.0\.1:8080\/([a-zA-Z0-9-]+)\/widget\.js/;
    let element, src, matches;

    for (element of scripts) {
      src = element.src;
      if (src) {
        matches = src.match(siteRegex)
        if (matches) {
          params.shortname = matches[1]
          return [element, params];
        }
      }
    }
    return null;
  }


  function loadSupportingFiles(callback) {
    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.3/iframeResizer.min.js', 
      'sha256-DyeqmZcGhOAc1ZUAyHN3cS9xC3HsFj27zcWVbK6/m0I=',
      function(){ 
        console.log("Converting iframe into resizable one....")
        iframe = iFrameResize({log:true}, iframe) 
      },
      )
  }


  loadSupportingFiles();

  const [target, params] = getElementAndParams();


  // TODO security: trusting the user with number of params and value (no escaping)
  const queryParams = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
  const url = 'http://127.0.0.1:8080/embed.html'+'?'+queryParams
  console.log(url);
  iframe.src = url
 
  iframe.style.border = 'none';

  target.parentNode.insertBefore(iframe, target);


  return braincards;
})();

