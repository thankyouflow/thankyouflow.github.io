"use strict";(self.webpackChunkgatsby_starter_default=self.webpackChunkgatsby_starter_default||[]).push([[133],{9598:function(t,e,i){i.r(e),i.d(e,{default:function(){return M}});var n=i(3017),a=i(7462),r=i(4316),o=i(8032),l=i(917);const s=(0,r.Z)("div",{target:"e1st1jau3"})({name:"1g3rofh",styles:"display:flex;flex-direction:column;width:1020px;height:100%;margin:18px auto;padding:60px 0;color:#ffffff;@media (max-width: 1020px){width:100%;padding:40px 20px;}"}),d=(0,r.Z)("div",{target:"e1st1jau1"})({name:"mr1dlz",styles:"display:-webkit-box;overflow:hidden;overflow-wrap:break-word;margin-top:auto;text-overflow:ellipsis;white-space:normal;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:32px;font-weight:800;@media (max-width: 1020px){font-size:30px;}"}),p=(0,r.Z)("div",{target:"e1st1jau0"})({name:"r2opto",styles:"display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:18px;font-weight:700;@media (max-width: 1020px){flex-direction:column;align-items:flex-start;font-size:15px;font-weight:400;}"});var h=function(t){let{title:e,date:i,categories:n}=t;return(0,l.tZ)(s,null,(0,l.tZ)(d,null,e),(0,l.tZ)(p,null,(0,l.tZ)("div",null,n.join(" / ")),(0,l.tZ)("div",null,i)))};const g=(0,r.Z)("div",{target:"e1opi4mu1"})({name:"qlg4w2",styles:"position:relative;width:100%;height:400px;@media (max-width: 1020px){height:300px;}"}),c=(0,r.Z)((t=>(0,l.tZ)(o.G,(0,a.Z)({},t,{style:{position:"absolute",height:"300px"}}))),{target:"e1opi4mu0"})({name:"1ai0daa",styles:"z-index:-1;width:100%;height:400px;object-fit:cover;filter:brightness(0.25);@media (max-width: 1020px){height:300px;}"});var x=function(t){let{title:e,date:i,categories:n,thumbnail:a}=t;return(0,l.tZ)(g,null,(0,l.tZ)(c,{image:a,alt:"thumbnail"}),(0,l.tZ)(h,{title:e,date:i,categories:n}))},u=i(7294);const m={threshold:.4,rootMargin:"-60px 0px 0px 0px"},f=t=>{let e="",i=0;return new IntersectionObserver((n=>{n.forEach((n=>{var a;a=i,0===window.scrollY&&0===a||(e=window.scrollY>a?"down":"up",i=window.scrollY),("down"===e&&!n.isIntersecting||"up"===e&&n.isIntersecting)&&t(n.target.innerHTML)}))}),m)};const w=(0,r.Z)("div",{target:"e1ijh0y15"})({name:"1qv94lq",styles:"display:flex;flex-direction:column;width:800px;margin:0 auto;padding:100px 0;word-break:break-all;line-height:1.8;font-size:16px;font-weight:400;p{padding:3px 0;}h1,h2,h3{font-weight:800;margin-bottom:30px;}*+h1,*+h2,*+h3{margin-top:80px;}hr+h1,hr+h2,hr+h3{margin-top:0;}h1{font-size:30px;}h2{font-size:25px;}h3{font-size:20px;}blockquote{margin:30px 0;padding:5px 15px;border-left:2px solid #000000;font-weight:800;}ol,ul{margin-left:20px;padding:30px 0;}hr{border:1px solid #000000;margin:100px 0;}a{color:#4263eb;text-decoration:underline;}pre[class*='language-']{margin:30px 0;padding:15px;font-size:15px;::-webkit-scrollbar-thumb{background:rgba(255, 255, 255, 0.5);border-radius:3px;}}code[class*='language-'],pre[class*='language-']{tab-size:2;}@media (max-width: 800px){width:100%;padding:80px 20px;line-height:1.6;font-size:14px;h1{font-size:23px;}h2{font-size:20px;}h3{font-size:17px;}img{width:100%;}hr{margin:50px 0;}}"}),b=(0,r.Z)("div",{target:"e1ijh0y14"})("padding:6px 0px;opacity:",(t=>t.HighLight?"1":"0.5"),";font-size:17px;color:",(t=>t.HighLight?"#8ddb8c":"#000"),";&:hover{color:-webkit-link;cursor:pointer;text-decoration:underline;}"),y=(0,r.Z)("div",{target:"e1ijh0y13"})("padding:6px 0px;border-left:1px solid #000;color:",(t=>t.HighLight?"#8ddb8c":"#000"),";font-size:17px;opacity:",(t=>t.HighLight?"1":"0.5"),";margin-left:5px;padding-left:10px;&:hover{color:-webkit-link;cursor:pointer;text-decoration:underline;}"),Z=(0,r.Z)("div",{target:"e1ijh0y12"})({name:"zjik7",styles:"display:flex"}),v=(0,r.Z)("div",{target:"e1ijh0y11"})({name:"z9fnf8",styles:"display:block;position:fixed;width:500px;margin:110px auto;left:0;right:0"}),k=(0,r.Z)("div",{target:"e1ijh0y10"})({name:"1mfzxsn",styles:"margin-left:700px;width:300px"}),z={name:"1wwk2bk",styles:"width:150px"};var j=function(t){let{html:e}=t;const{0:i,1:n}=(0,u.useState)(""),{0:a,1:r}=(0,u.useState)([]);return(0,u.useEffect)((()=>{const t=f(n),e=Array.from(document.querySelectorAll("h1, h2"));r(e),e.map((e=>{t.observe(e)}))}),[]),console.log(i),(0,l.tZ)(Z,null,(0,l.tZ)(w,{dangerouslySetInnerHTML:{__html:e}}),(0,l.tZ)(v,null,(0,l.tZ)(k,null,a.map((t=>{let e=!1;return i==t.innerHTML&&(e=!0),"H1"==t.tagName?(0,l.tZ)(b,{HighLight:e},(0,l.tZ)("a",{href:"#"+t.innerHTML},(0,l.tZ)("div",{css:z},t.innerHTML))):"H2"==t.tagName?(0,l.tZ)(y,{HighLight:e},(0,l.tZ)("a",{href:"#"+t.innerHTML},(0,l.tZ)("div",{css:z},t.innerHTML))):void 0})))))};const H=(0,r.Z)("div",{target:"e1gqsjds0"})({name:"mpjvk0",styles:"@media (max-width: 1020px){padding:0 20px;}"});var L=function(){const t=(0,u.createRef)();return(0,u.useEffect)((()=>{if(null===t.current)return;const e=document.createElement("script"),i={src:"https://utteranc.es/client.js",repo:"thankyouflow/thankyouflow.github.io","issue-term":"pathname",label:"Comment",theme:"github-light",crossorigin:"anonymous",async:"true"};Object.entries(i).forEach((t=>{let[i,n]=t;e.setAttribute(i,n)})),t.current.appendChild(e)}),[]),(0,l.tZ)(H,{ref:t})};var M=function(t){let{data:{allMarkdownRemark:{edges:e}},location:{href:i}}=t;const{node:{html:a,frontmatter:{title:r,summary:o,date:s,categories:d,thumbnail:{childImageSharp:{gatsbyImageData:p},publicURL:h}}}}=e[0];return(0,l.tZ)(n.Z,{title:r,description:o,url:i,image:h},(0,l.tZ)(x,{title:r,date:s,categories:d,thumbnail:p}),(0,l.tZ)(j,{html:a}),(0,l.tZ)(L,null))}}}]);
//# sourceMappingURL=component---src-templates-post-template-tsx-fc3245742d6f0bade985.js.map