(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{4612:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return l}});var o=t(4246),i=t(2547),r=t(7378),s=t(7061),u=function(){var e=(0,i.useGoogleLogin)(),n=e.profile,t=e.auth,u=e.ready,l=e.isSignedIn,a=e.idToken;return(0,r.useEffect)((function(){s.env.NEXT_PUBLIC_DEMO_SERVER&&a&&n&&fetch(s.env.NEXT_PUBLIC_DEMO_SERVER,{headers:{"google-token":a}}).then((function(e){return e.json()})).then((function(e){if(e.email!==(null===n||void 0===n?void 0:n.email))throw new Error("Demo server not working");console.log("OK")}))}),[a,n]),u?(0,o.jsxs)("div",{style:{display:"flex"},children:[(0,o.jsx)("button",{style:{display:"block"},onClick:function(){return l?null===t||void 0===t?void 0:t.signOut():null===t||void 0===t?void 0:t.signIn()},children:l?"Logout":"Login"}),l?(0,o.jsx)("span",{children:null===n||void 0===n?void 0:n.email}):null]}):null};function l(){return(0,o.jsxs)(i.GoogleLoginProvider,{clientConfig:{client_id:"948918026196-q49uid1opmf7oid570ptpl7kd1alcjru.apps.googleusercontent.com"},children:[(0,o.jsx)("h2",{children:"Google Login Demo"}),(0,o.jsx)(u,{})]})}},4423:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(4612)}])},7061:function(e){var n,t,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function s(e){if(n===setTimeout)return setTimeout(e,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"===typeof setTimeout?setTimeout:i}catch(e){n=i}try{t="function"===typeof clearTimeout?clearTimeout:r}catch(e){t=r}}();var u,l=[],a=!1,c=-1;function d(){a&&u&&(a=!1,u.length?l=u.concat(l):c=-1,l.length&&g())}function g(){if(!a){var e=s(d);a=!0;for(var n=l.length;n;){for(u=l,l=[];++c<n;)u&&u[c].run();c=-1,n=l.length}u=null,a=!1,function(e){if(t===clearTimeout)return clearTimeout(e);if((t===r||!t)&&clearTimeout)return t=clearTimeout,clearTimeout(e);try{t(e)}catch(n){try{return t.call(null,e)}catch(n){return t.call(this,e)}}}(e)}}function f(e,n){this.fun=e,this.array=n}function h(){}o.nextTick=function(e){var n=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)n[t-1]=arguments[t];l.push(new f(e,n)),1!==l.length||a||s(g)},f.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=h,o.addListener=h,o.once=h,o.off=h,o.removeListener=h,o.removeAllListeners=h,o.emit=h,o.prependListener=h,o.prependOnceListener=h,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},2547:function(e,n,t){var o=this&&this.__createBinding||(Object.create?function(e,n,t,o){void 0===o&&(o=t),Object.defineProperty(e,o,{enumerable:!0,get:function(){return n[t]}})}:function(e,n,t,o){void 0===o&&(o=t),e[o]=n[t]}),i=this&&this.__setModuleDefault||(Object.create?function(e,n){Object.defineProperty(e,"default",{enumerable:!0,value:n})}:function(e,n){e.default=n}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&o(n,e,t);return i(n,e),n},s=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))((function(i,r){function s(e){try{l(o.next(e))}catch(n){r(n)}}function u(e){try{l(o.throw(e))}catch(n){r(n)}}function l(e){var n;e.done?i(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(s,u)}l((o=o.apply(e,n||[])).next())}))},u=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0}),n.WithGoogleEmail=n.useGoogleEmail=n.WithGoogleTokens=n.useGoogleTokens=n.WithGoogleUser=n.useGoogleUser=n.WithGoogleLogin=n.useGoogleLogin=n.GoogleLoginProvider=void 0;const l=u(t(3615)),a=r(t(7378)),c=a.createContext({available:!1,auth:null,user:null,profile:void 0,ready:!1,err:void 0,isSignedIn:!1,loggingIn:!1,idToken:void 0,accessToken:void 0,setLoggingIn:()=>{throw Error("GoogleLoginContext not defined")}}),d=e=>{const n=e.getBasicProfile();if(n)return{id:n.getId(),name:n.getName(),givenName:n.getGivenName(),familyName:n.getFamilyName(),imageUrl:n.getImageUrl(),email:n.getEmail()}},g={idToken:void 0,accessToken:void 0};n.GoogleLoginProvider=({clientConfig:e,libraryURI:n,children:t,refreshRate:o=18e5})=>{const[i,r]=a.useState({auth:null,ready:!1,err:void 0}),[u,l]=a.useState({user:null,isSignedIn:void 0}),f=a.useMemo((()=>{if("undefined"===typeof window)return g;const e=localStorage.getItem("react-google-login:tokens");if(!e)return g;const{idToken:n,accessToken:t,saved:o}=JSON.parse(e);return!o||o+18e5<(new Date).valueOf()?g:{idToken:n,accessToken:t}}),[]),[h,v]=a.useState(f),[p,m]=a.useState(!1),[T,y]=a.useState(),_=a.useCallback((()=>{window.gapi.load("auth2",(()=>{window.gapi.auth2.init(e).then((e=>{r({auth:e,ready:!0,err:void 0});const n=e.currentUser.get();l({user:n,isSignedIn:n.isSignedIn()}),n&&y(d(n)),e.currentUser.listen((e=>{l({user:e,isSignedIn:e.isSignedIn()}),e.isSignedIn()?y(d(e)):(v(g),y(void 0)),e.isSignedIn()}))}),(e=>{throw r({auth:null,ready:!1,err:e}),e}))}))}),[e]);return a.useEffect((()=>{if(window.gapi)return void _();const e=document.head.querySelector(`script[src="${n}"]`);if(e)return void(e.onload=_);const t=Object.assign(document.createElement("script"),{src:n,async:!0,defer:!0});return t.onload=_,document.head.appendChild(t),()=>{document.head.removeChild(t)}}),[n,_]),a.useEffect((()=>{h.idToken?localStorage.setItem("react-google-login:tokens",JSON.stringify(Object.assign(Object.assign({},h),{saved:(new Date).valueOf()}))):localStorage.removeItem("react-google-login:tokens")}),[h]),a.useEffect((()=>{if(!(null===u||void 0===u?void 0:u.isSignedIn))return;const e=()=>s(this,void 0,void 0,(function*(){if(!u.user)return;const{id_token:e,access_token:n}=yield u.user.reloadAuthResponse();v({idToken:e,accessToken:n})})),n=setInterval((()=>s(this,void 0,void 0,(function*(){yield e()}))),o);return e(),()=>{clearInterval(n)}}),[u.user,u.isSignedIn,o]),a.default.createElement(c.Provider,{value:Object.assign(Object.assign(Object.assign(Object.assign({available:!0},i),u),h),{loggingIn:p,setLoggingIn:m,profile:T})},t)},n.GoogleLoginProvider.propTypes={clientConfig:l.default.exact({client_id:l.default.string.isRequired,cookie_policy:l.default.string,scope:l.default.string,fetch_basic_profile:l.default.bool,hosted_domain:l.default.string,openid_realm:l.default.string,ux_mode:l.default.string,redirect_uri:l.default.string}).isRequired,libraryURI:l.default.string,children:l.default.node.isRequired,refreshRate:l.default.number},n.GoogleLoginProvider.defaultProps={libraryURI:"https://apis.google.com/js/platform.js"};n.useGoogleLogin=()=>a.useContext(c);n.WithGoogleLogin=({children:e})=>e(n.useGoogleLogin()),n.WithGoogleLogin.propTypes={children:l.default.func.isRequired};n.useGoogleUser=()=>{const{user:e,isSignedIn:n}=a.useContext(c);return{user:e,isSignedIn:n}};n.WithGoogleUser=({children:e})=>e(n.useGoogleUser()),n.WithGoogleUser.propTypes={children:l.default.func.isRequired};n.useGoogleTokens=()=>{const{idToken:e,accessToken:n}=a.useContext(c);return{idToken:e,accessToken:n}};n.WithGoogleTokens=({children:e})=>e(n.useGoogleTokens()),n.WithGoogleTokens.propTypes={children:l.default.func.isRequired};n.useGoogleEmail=()=>{const{user:e,isSignedIn:n}=a.useContext(c);if(e&&n)return null===e||void 0===e?void 0:e.getBasicProfile().getEmail()};n.WithGoogleEmail=({children:e})=>e(n.useGoogleEmail()),n.WithGoogleEmail.propTypes={children:l.default.func.isRequired}}},function(e){e.O(0,[774,888,179],(function(){return n=4423,e(e.s=n);var n}));var n=e.O();_N_E=n}]);