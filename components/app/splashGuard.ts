export const SPLASH_SEEN_KEY = "tritorc-splash-seen";

/**
 * Inline script rendered in <body> before the splash: flags repeat visits
 * before first paint so the curtain never flashes on later loads.
 */
export const SPLASH_GUARD_SCRIPT = `try{if(sessionStorage.getItem("${SPLASH_SEEN_KEY}")==="1"){document.documentElement.setAttribute("data-splash-seen","")}else{sessionStorage.setItem("${SPLASH_SEEN_KEY}","1")}}catch(e){}`;
