(function(){
  // Determine base URL relative to this script's location
  var script = document.currentScript || (function(){
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length-1];
  })();
  var scriptUrl = script && script.src ? script.src : window.location.href;
  var base = scriptUrl.replace(/\/scripts\/footer-loader\.js(\?.*)?$/,'/');

  var footerUrl = base + 'footer.html';
  var cssUrl = base + 'styles/weather.css';
  var jsUrl = base + 'scripts/weather.js';

  function alreadyLoaded(href){
    return !!document.querySelector('link[href="'+href+'"], script[src="'+href+'"]');
  }

  var placeholder = document.getElementById('footer-placeholder');
  if(!placeholder) return;

  fetch(footerUrl).then(function(r){
    if(!r.ok) throw new Error('Unable to fetch footer');
    return r.text();
  }).then(function(html){
    placeholder.innerHTML = html;
    // load CSS if not present
    if(!alreadyLoaded(cssUrl)){
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = cssUrl; document.head.appendChild(l);
    }
    // load weather script
    if(!alreadyLoaded(jsUrl)){
      var s = document.createElement('script'); s.src = jsUrl; s.defer = true; document.body.appendChild(s);
    }
  }).catch(function(err){
    console.error(err);
    placeholder.innerHTML = '<footer class="site-footer"><div class="footer-inner"><div class="footer-left"><p>&copy; 2026 Jason. All rights reserved.</p></div></div></footer>';
  });
})();
