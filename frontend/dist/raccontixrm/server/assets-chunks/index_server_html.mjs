export default `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8"/>
  <title id="app-title">RaccontiXRM</title>
  <base href="/"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="description" content="Your Organisation's only dashboard for everything"/>
  <meta name="keywords" content="business management, resource management, HR, CRM, project management, inventory"/>
  <meta name="author" content="Rohan Bhuri"/>
  <meta name="robots" content="index, follow"/>
  <meta name="theme-color" content="#050d1aff"/>
  <meta name="color-scheme" content="light dark"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

  <!-- Performance hints -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin=""/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="RaccontiXRM"/>
  <meta property="og:description" content="Your Organisation's only dashboard for everything"/>
  <meta property="og:site_name" content="RaccontiXRM"/>
  <meta property="og:url" content="https://xrm.racconti.in"/>
  <meta property="og:locale" content="en_US"/>

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="RaccontiXRM"/>
  <meta name="twitter:description" content="Your Organisation's only dashboard for everything"/>
  <meta name="twitter:site" content="@RaccontiXRM"/>

  <!-- Icons -->
  <link rel="icon" type="image/x-icon" href="favicon.ico" id="app-favicon"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/config/assets/raccontixrm/icons/racconti-icon.svg"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/config/assets/raccontixrm/icons/racconti-icon.svg"/>
  <link rel="icon" type="image/png" sizes="16x16" href="/config/assets/raccontixrm/icons/racconti-icon.svg"/>

  <link rel="canonical" href="https://xrm.racconti.in"/>
  <link rel="manifest" href="/manifest.json"/>

  <!-- Optimized font loading -->
  <link rel="preload" href="https://fonts.googleapis.com/icon?family=Material+Icons&amp;display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
  <noscript>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" rel="stylesheet" />
  </noscript>

  <!-- Material theme loaded dynamically -->
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/@angular/material@20/prebuilt-themes/indigo-pink.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
  <noscript>
    <link href="https://cdn.jsdelivr.net/npm/@angular/material@20/prebuilt-themes/indigo-pink.css" rel="stylesheet" />
  </noscript>
  <!-- Critical CSS inlined -->
  <style>
    :root {
      --primary-color: #050d1aff;
      --accent-color: #b69253ff;
      --secondary-color: #fff4cbff;
    }

    body {
      margin: 0;
      font-family: Roboto, sans-serif;
      background: var(--primary-color);
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      color: white;
    }

    .skip-link {
      position: absolute;
      left: -9999px;
    }

    .skip-link:focus {
      left: 16px;
      top: 16px;
      z-index: 10000;
      padding: 8px 12px;
      background: var(--primary-color);
      color: white;
    }
  </style>
  <!-- Model Viewer for 3D -->
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>

  <script>
    // Load brand configuration from environment
    window.brandConfig = {
      brand: {
        name: "RaccontiXRM",
        logo: "/config/assets/raccontixrm/icons/racconti-logo.svg",
        logoDark: "/config/assets/raccontixrm/icons/racconti-logo.svg",
        icon: "/config/assets/raccontixrm/icons/racconti-icon.svg",
      },
      colors: {
        primary: "#050d1aff",
        accent: "#b69253ff",
        secondary: "#fff4cbff",
      },
      app: {
        name: "RaccontiXRM",
        version: "0.0.1",
        description: "Your Organisation's only dashboard for everything",
        port: parseInt("4202"),
        apiUrl: "https://xrm.racconti.in/api",
      },
    };

    // Update title and favicon
    document.getElementById("app-title").textContent = window.brandConfig.app.name;
    document.getElementById("app-favicon").href = window.brandConfig.brand.icon;

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => console.log('SW registered:', registration))
          .catch(registrationError => console.log('SW registration failed:', registrationError));
      });
    }
  </script>
<link rel="stylesheet" href="styles-H2ZEUL6B.css"></head>

<body><script type="text/javascript" id="ng-event-dispatch-contract">(()=>{function p(t,n,r,o,e,i,f,m){return{eventType:t,event:n,targetElement:r,eic:o,timeStamp:e,eia:i,eirp:f,eiack:m}}function u(t){let n=[],r=e=>{n.push(e)};return{c:t,q:n,et:[],etc:[],d:r,h:e=>{r(p(e.type,e,e.target,t,Date.now()))}}}function s(t,n,r){for(let o=0;o<n.length;o++){let e=n[o];(r?t.etc:t.et).push(e),t.c.addEventListener(e,t.h,r)}}function c(t,n,r,o,e=window){let i=u(t);e._ejsas||(e._ejsas={}),e._ejsas[n]=i,s(i,r),s(i,o,!0)}window.__jsaction_bootstrap=c;})();
</script>
  <a class="skip-link" href="#main">Skip to main content</a>
  <app-root></app-root>
<link rel="modulepreload" href="chunk-2YD22TO6.js"><link rel="modulepreload" href="chunk-UXNUWAC7.js"><link rel="modulepreload" href="chunk-J3XKMZGZ.js"><link rel="modulepreload" href="chunk-B3WOMMY4.js"><link rel="modulepreload" href="chunk-MPZK6EZX.js"><link rel="modulepreload" href="chunk-AQ4IK6FB.js"><link rel="modulepreload" href="chunk-5YG7HWWN.js"><link rel="modulepreload" href="chunk-X4B4XGMT.js"><link rel="modulepreload" href="chunk-LAORAIJF.js"><link rel="modulepreload" href="chunk-KAK65TYP.js"><script src="main-L4NRWYXH.js" type="module"></script></body>

</html>`;