(this.webpackJsonpcovid19india=this.webpackJsonpcovid19india||[]).push([[29],{118:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var a=n(78),r=n(142),c=n(0),i=function(t){var e=Object(c.useState)(null),n=Object(a.a)(e,2),i=n[0],o=n[1];return Object(c.useEffect)((function(){var e=t.current,n=new r.a((function(t,e){t.forEach((function(t,e){o(t.contentRect)}))}));return n.observe(e),function(){n.unobserve(e)}}),[t]),i}},241:function(t,e,n){"use strict";n.r(e);var a=n(78),r=n(23),c=n(118),i=n(31),o=n(79),s=n.n(o),u=n(132),l=n(170),f=n(169),d=n(108),b=n(116),m=n(232),j=n(119),O=n(174),h=n(131),v=function(t){var e=function(){for(var t,e=h.b;t=e.sourceEvent;)e=t;return e}();return e.changedTouches&&(e=e.changedTouches[0]),function(t,e){var n=t.ownerSVGElement||t;if(n.createSVGPoint){var a=n.createSVGPoint();return a.x=e.clientX,a.y=e.clientY,[(a=a.matrixTransform(t.getScreenCTM().inverse())).x,a.y]}var r=t.getBoundingClientRect();return[e.clientX-r.left-t.clientLeft,e.clientY-r.top-t.clientTop]}(t,e)},g=n(215),p=n(238),x=n(220),k=(n(103),n(59)),y=n(60),E=n(82),M=n.n(E),N=n(0),w=n.n(N),T=n(250),A=15,C=35,R=25,S=25;e.default=w.a.memo((function(t){var e=t.timeseries,n=t.dates,o=t.chartType,h=t.isUniform,E=t.isLog,M=Object(T.a)().t,L=Object(N.useRef)([]),Y=Object(N.useRef)(),H=Object(c.a)(Y),P=Object(N.useState)(),U=Object(a.a)(P,2),V=U[0],B=U[1];Object(N.useEffect)((function(){B(n[n.length-1])}),[n]);var G=Object(N.useCallback)((function(){var t=n.length,e=(H||Y.current.getBoundingClientRect()).width-C-S;return Math.min(4,e/(1.25*t))}),[n.length,H]);Object(N.useEffect)((function(){var t=n.length,a=H||Y.current.getBoundingClientRect(),c=a.width,s=a.height,k=c-C,y=s-R,M=G(),N=Object(m.a)().clamp(!0).domain(t?[Object(i.k)(n[0]),Object(i.k)(n[t-1])]:[]).range([S,k]),w=c<480?4:7,T=function(t){return t.attr("class","x-axis").call(Object(d.a)(N).ticks(w).tickFormat((function(t){return Object(i.c)(t,"dd MMM")})))},P=function(t,e){t.attr("class","x-axis2").call(Object(d.a)(N).tickValues([]).tickSize(0)).select(".domain").style("transform","translateY(".concat(e(0),"px)")),e(0)!==y?t.select(".domain").attr("opacity",.4):t.select(".domain").attr("opacity",0)},U=function(t,e){return t.attr("class","y-axis").call(Object(d.b)(e).ticks(4,"0~s").tickPadding(4))},V=Object(u.a)(n,(function(t){return Object(i.i)(e[t],o,"active")})),X=Object(l.a)(n,(function(t){return Math.max(Object(i.i)(e[t],o,"confirmed"),Object(i.i)(e[t],o,"recovered"),Object(i.i)(e[t],o,"deceased"))})),F=Object(j.a)().clamp(!0).domain([V,Math.max(1,1.2*X)]).nice(4).range([y,A]),J=Object(O.a)().clamp(!0).domain([Math.max(1,V),Math.max(10,1.2*X)]).nice(4).range([y,A]);function z(){var t=v(this)[0],e=N.invert(t);if(!isNaN(e)){var a=(0,Object(f.a)((function(t){return Object(i.k)(t)})).left)(n,e,1),r=n[a-1],c=n[a];B(e-Object(i.k)(r)<Object(i.k)(c)-e?r:c)}}function D(){B(n[t-1])}L.current.forEach((function(a,c){var s=Object(g.a)(a),f=s.transition().duration(r.c),d=r.w[c],m=function(t){return h&&"total"===o&&E&&"tested"!==t?J:h&&"tested"!==t?F:"total"===o&&E?Object(O.a)().clamp(!0).domain([Math.max(1,Object(u.a)(n,(function(n){return Object(i.i)(e[n],o,t)||0}))),Math.max(10,1.2*Object(l.a)(n,(function(n){return Object(i.i)(e[n],o,t)||0})))]).nice(4).range([y,A]):Object(j.a)().clamp(!0).domain([1.1*Math.min(0,Object(u.a)(n,(function(n){return Object(i.i)(e[n],o,t)||0}))),Math.max(1,1.2*Object(l.a)(n,(function(n){return Object(i.i)(e[n],o,t)||0})))]).nice(4).range([y,A])}(d),v=r.b[d];if(s.select(".x-axis").style("transform","translateY(".concat(y,"px)")).transition(f).call(T),s.select(".x-axis2").transition(f).call(P,m),s.select(".y-axis").style("transform","translateX(".concat(k,"px)")).transition(f).call(U,m),s.selectAll("circle").data(n,(function(t){return t})).join((function(t){return t.append("circle").attr("fill",v).attr("stroke",v).attr("cy",y).attr("cx",(function(t){return N(Object(i.k)(t))}))})).transition(f).attr("r",M/2).attr("cx",(function(t){return N(Object(i.k)(t))})).attr("cy",(function(t){return m(Object(i.i)(e[t],o,d)||0)})),"total"===o){s.selectAll(".stem").transition(f).attr("y1",m(0)).attr("y2",m(0)).remove();var w,C=Object(p.a)().curve(x.a).x((function(t){return N(Object(i.k)(t))})).y((function(t){return m(Object(i.i)(e[t],o,d)||0)}));s.selectAll(".trend").data(t?[n]:[]).join((function(t){return t.append("path").attr("class","trend").attr("fill","none").attr("stroke",v+"50").attr("stroke-width",4).attr("d",C).attr("stroke-dasharray",(function(){return w=this.getTotalLength()})).call((function(t){return t.attr("stroke-dashoffset",w).transition(f).attr("stroke-dashoffset",0)}))}),(function(t){return t.attr("stroke-dasharray",null).transition(f).attrTween("d",(function(t){var e=Object(g.a)(this).attr("d"),n=C(t);return Object(b.interpolatePath)(e,n)}))}))}else s.selectAll(".trend").remove(),s.selectAll(".stem").data(n,(function(t){return t})).join((function(t){return t.append("line").attr("class","stem").attr("stroke-width",M).attr("x1",(function(t){return N(Object(i.k)(t))})).attr("y1",y).attr("x2",(function(t){return N(Object(i.k)(t))})).attr("y2",y)})).transition(f).attr("stroke-width",M).attr("x1",(function(t){return N(Object(i.k)(t))})).attr("y1",m(0)).attr("x2",(function(t){return N(Object(i.k)(t))})).attr("y2",(function(t){return m(Object(i.i)(e[t],o,d)||0)}));s.selectAll("*").attr("pointer-events","none"),s.on("mousemove",z).on("touchmove",z).on("mouseout",D).on("touchend",D)}))}),[o,H,G,h,E,e,n]),Object(N.useEffect)((function(){var t=G();L.current.forEach((function(e){Object(g.a)(e).selectAll("circle").attr("r",(function(e){return e===V?t:t/2}))}))}),[V,G]);var X=Object(N.useCallback)((function(t){if(V){var n=Object(i.i)(null===e||void 0===e?void 0:e[V],"delta",t);if("total"===o)return n;var a=Object(k.a)(Object(y.a)(Object(i.k)(V),1),{representation:"date"});return n-Object(i.i)(null===e||void 0===e?void 0:e[a],"delta",t)}}),[e,V,o]),F=Object(N.useMemo)((function(){var t=[];return[0,0,0,0,0].map((function(e,n){return t.push({animationDelay:"".concat(250*n,"ms")}),null})),t}),[]);return w.a.createElement(w.a.Fragment,null,w.a.createElement("div",{className:"Timeseries"},r.w.map((function(t,n){var a=X(t,n);return w.a.createElement("div",{key:t,className:s()("svg-parent fadeInUp","is-".concat(t)),ref:Y,style:F[n]},V&&w.a.createElement("div",{className:s()("stats","is-".concat(t))},w.a.createElement("h5",{className:"title"},M(Object(i.a)(t))),w.a.createElement("h5",{className:"title"},Object(i.c)(V,"dd MMMM")),w.a.createElement("div",{className:"stats-bottom"},w.a.createElement("h2",null,Object(i.e)(Object(i.i)(null===e||void 0===e?void 0:e[V],o,t))),w.a.createElement("h6",null,"".concat(a>=0?"+":"").concat(Object(i.e)(a))))),w.a.createElement("svg",{ref:function(t){L.current[n]=t},preserveAspectRatio:"xMidYMid meet"},w.a.createElement("g",{className:"x-axis"}),w.a.createElement("g",{className:"x-axis2"}),w.a.createElement("g",{className:"y-axis"})))}))))}),(function(t,e){return!!M()(e.chartType,t.chartType)&&(!!M()(e.isUniform,t.isUniform)&&(!!M()(e.isLog,t.isLog)&&(!!M()(e.regionHighlighted.stateCode,t.regionHighlighted.stateCode)&&(!!M()(e.regionHighlighted.districtName,t.regionHighlighted.districtName)&&!!M()(e.dates,t.dates)))))}))}}]);
//# sourceMappingURL=29.5285b1f3.chunk.js.map