"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[581],{4940:(e,t,c)=>{c.r(t),c.d(t,{assets:()=>a,contentTitle:()=>d,default:()=>m,frontMatter:()=>n,metadata:()=>i,toc:()=>l});var s=c(2540),r=c(3023),o=c(2317);const n={},d="Records",i={id:"matchers/collections/records",title:"Records",description:".toBeRecordOf(expected)",source:"@site/docs/matchers/collections/records.mdx",sourceDirName:"matchers/collections",slug:"/matchers/collections/records",permalink:"/mix-n-matchers/matchers/collections/records",draft:!1,unlisted:!1,editUrl:"https://github.com/EskiMojo14/mix-n-matchers/tree/main/website/docs/matchers/collections/records.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Iterables",permalink:"/mix-n-matchers/matchers/collections/iterables"},next:{title:"Enums",permalink:"/mix-n-matchers/matchers/enums"}},a={},l=[{value:"<code>.toBeRecordOf(expected)</code>",id:"toberecordofexpected",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"records",children:"Records"}),"\n",(0,s.jsx)(t.h2,{id:"toberecordofexpected",children:(0,s.jsx)(t.code,{children:".toBeRecordOf(expected)"})}),"\n",(0,s.jsxs)(t.p,{children:["Also available as an asymmetric matcher, ",(0,s.jsx)(t.code,{children:"expect.recordOf(expected)"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["Use ",(0,s.jsx)(t.code,{children:".toBeRecordOf"})," to assert that a value is an object where each value matches the ",(0,s.jsx)(t.code,{children:"expected"})," value, using deep equality."]}),"\n",(0,s.jsx)(t.p,{children:"Optionally, you can pass two arguments and the first one will be matched against keys."}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:".toBeStrictRecordOf(expected)"})," and ",(0,s.jsx)(t.code,{children:"expect.strictRecordOf(expected)"})," are also available to use ",(0,s.jsx)(t.a,{href:"https://jestjs.io/docs/expect#tostrictequalvalue",children:"strict deep equality"}),"."]}),"\n",(0,s.jsx)(o.Z,{name:"toBeRecordOf",children:'\nconst record = { a: 1, b: 2, c: 3 };\n\nit("is a record of the expected values", () => {\n  expect(record).toBeRecordOf(expect.any(Number));\n  expect(record).toBeRecordOf(expect.any(String), expect.any(Number));\n});\n'}),"\n",(0,s.jsxs)(t.admonition,{type:"caution",children:[(0,s.jsx)(t.mdxAdmonitionTitle,{}),(0,s.jsxs)(t.p,{children:["Keys and values are retrieved using ",(0,s.jsx)(t.code,{children:"Object.entries"}),", so only string (non-symbol) enumerable keys are checked."]})]})]})}function m(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}}}]);