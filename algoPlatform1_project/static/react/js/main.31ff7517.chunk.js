(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{168:function(e,t,a){e.exports=a(304)},173:function(e,t,a){},179:function(e,t,a){},304:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a.n(n),c=a(21),o=a.n(c),i=(a(173),a(40)),l=(a(179),a(23)),u=a(136),m=a(137),d=a.n(m),s=a(138),h=a(67),v={tickers:"AAPL"},E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD_START_DATE":return Object(h.a)({},e,{startDate:t.payload});default:return e}},f={tickers:"AAPL"},p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD_TICKER":return Object(h.a)({},e,{tickers:t.payload});default:return e}},b=Object(l.combineReducers)({tickersFromRootReducer:p,datesFromRootReducer:E}),D=Object(l.createStore)(b,Object(u.composeWithDevTools)(Object(l.applyMiddleware)(d.a,s.a))),k=a(45),w=a(314),A=a(313),y=a(305),T=a(29);var g=Object(i.b)((function(e){return{tickers:e.tickersFromRootReducer.tickers}}),(function(e){return{addTickerDispatch:function(t){return e(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"AAPL";return{type:"ADD_TICKER",payload:e}}(t))}}}))((function(e){var t=Object(n.useState)(""),a=Object(k.a)(t,2),c=a[0],o=a[1];return r.a.createElement("div",null,r.a.createElement(w.a,null,r.a.createElement(A.a,{placeholder:"Add ticker ex) APPL",value:c,name:"newTicker",onChange:function(e){return o(e.target.value)},isClearable:!0}),r.a.createElement(y.a,{animated:!0,primary:!0,onClick:function(t){return e.addTickerDispatch(c)}},r.a.createElement(y.a.Content,{visible:!0},"Go!"),r.a.createElement(y.a.Content,{hidden:!0},r.a.createElement(T.a,{name:"arrow right"})))))})),j=a(316);var O=Object(i.b)((function(e){return{startDate:e.datesFromRootReducer.startDate}}),(function(e){return{addStartDateDispatch:function(t){return e({type:"ADD_START_DATE",payload:t})}}}))((function(e){var t=Object(n.useState)(""),a=Object(k.a)(t,2),c=a[0],o=a[1],i=new Date,l=(i.setTime(i.getTime()-157248e5),Object(n.useState)(i)),u=Object(k.a)(l,2),m=u[0],d=u[1];function s(t,a){o(a);var n=new Date,r=864e5*t;n.setTime(n.getTime()-r);d(n),e.addStartDateDispatch(m)}return r.a.createElement("div",null,r.a.createElement(j.a,{widths:4},r.a.createElement(j.a.Item,{name:"5d",active:"5d"===c,onClick:function(){return s(8,"5d")}},"5 d"),r.a.createElement(j.a.Item,{name:"1m",active:"1m"===c,onClick:function(){return s(30,"1m")}},"1 m"),r.a.createElement(j.a.Item,{name:"6m",active:"6m"===c,onClick:function(){return s(180,"6m")}},"6 m"),r.a.createElement(j.a.Item,{name:"1y",active:"1y"===c,onClick:function(){return s(365,"1y")}},"1 y")))})),R=a(317);var C=function(){return r.a.createElement(i.a,{store:D},r.a.createElement("div",{className:"App"},r.a.createElement(R.a,{celled:!0},r.a.createElement(R.a.Column,{width:4},r.a.createElement(R.a.Row,{stretched:!0},r.a.createElement(g,null),r.a.createElement("br",null),r.a.createElement(O,null))),r.a.createElement(R.a.Column,{width:12},r.a.createElement(g,null)))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(303);o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(C,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[168,1,2]]]);
//# sourceMappingURL=main.31ff7517.chunk.js.map