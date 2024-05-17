"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[405],{4098:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>u,default:()=>p,frontMatter:()=>c,metadata:()=>l,toc:()=>d});var r=n(2540),s=n(3023),a=n(2317),i=n(8296),o=n(2491);const c={},u="Enums",l={id:"matchers/enums",title:"Enums",description:".toBeEnum(enum)",source:"@site/docs/matchers/enums.mdx",sourceDirName:"matchers",slug:"/matchers/enums",permalink:"/mix-n-matchers/matchers/enums",draft:!1,unlisted:!1,editUrl:"https://github.com/EskiMojo14/mix-n-matchers/tree/main/website/docs/matchers/enums.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Records",permalink:"/mix-n-matchers/matchers/collections/records"},next:{title:"Mocks",permalink:"/mix-n-matchers/matchers/mocks"}},m={},d=[{value:"<code>.toBeEnum(enum)</code>",id:"tobeenumenum",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"enums",children:"Enums"}),"\n",(0,r.jsx)(t.h2,{id:"tobeenumenum",children:(0,r.jsx)(t.code,{children:".toBeEnum(enum)"})}),"\n",(0,r.jsxs)(t.p,{children:["Also available as an asymmetric matcher, ",(0,r.jsx)(t.code,{children:"expect.ofEnum(enum)"}),"."]}),"\n",(0,r.jsxs)(t.p,{children:["Use ",(0,r.jsx)(t.code,{children:".toBeEnum"})," to assert that a value is a member of an enum (or const object)."]}),"\n",(0,r.jsx)(a.l,{files:{"/numeric.test.ts":'\nenum Direction {\n  Up,\n  Down,\n  Left,\n  Right,\n}\n\nit("is a member of the numeric enum", () => {\n  expect(Direction.Up).toBeEnum(Direction);\n});\n',"/string.test.ts":'\nenum Direction {\n  Up = "UP",\n  Down = "DOWN",\n  Left = "LEFT",\n  Right = "RIGHT",\n}\n\nit("is a member of the string enum", () => {\n  expect(Direction.Up).toBeEnum(Direction);\n});\n',"/heterogenous.test.ts":'\nenum Direction {\n  Up = "UP",\n  Down = 1,\n  Left = "LEFT",\n  Right = 2,\n}\n\nit("is a member of the string enum", () => {\n  expect(Direction.Up).toBeEnum(Direction);\n});\n',"/const object.test.ts":'\nconst Direction = {\n  Up: "UP",\n  Down: "DOWN",\n  Left: "LEFT",\n  Right: "RIGHT",\n} as const;\n\nit("is a member of the const object", () => {\n  expect(Direction.Up).toBeEnum(Direction);\n});\n'}}),"\n",(0,r.jsxs)(t.admonition,{type:"tip",children:[(0,r.jsxs)(t.mdxAdmonitionTitle,{children:["Aliasing ",(0,r.jsx)(t.code,{children:"expect.ofEnum"})," to ",(0,r.jsx)(t.code,{children:"expect.enum"})]}),(0,r.jsxs)(t.p,{children:["As ",(0,r.jsx)(t.code,{children:"enum"})," is a reserved word in Javascript, it is not possible to export a matcher with this name. However, you can alias it in your setup file:"]}),(0,r.jsxs)(i.A,{groupId:"test-runner",children:[(0,r.jsx)(o.A,{value:"Jest",default:!0,children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport { exactly, ofEnum } from "mix-n-matchers";\nimport type { MixNMatchersFrom, AsymmetricMixNMatchersFrom } from "mix-n-matchers";\n\nconst matchers = {\n  exactly,\n  enum: ofEnum,\n};\n\nexpect.extend(matchers);\n\ndeclare global {\n  namespace jest {\n    interface Matchers<R, T> extends MixNMatchersFrom<typeof matchers, R, T> {}\n\n    interface Expect extends AsymmetricMixNMatchersFrom<typeof matchers> {\n      enum: AsymmetricMatchers["ofEnum"];\n    }\n\n    interface InverseAsymmetricMatchers\n      extends AsymmetricMixNMatchersFrom<typeof matchers> {\n      enum: AsymmetricMatchers["ofEnum"];\n    }\n  }\n}\n\n'})})}),(0,r.jsx)(o.A,{value:"Jest (no globals)",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport { expect } from "@jest/globals";\nimport { exactly, ofEnum } from "mix-n-matchers";\nimport type { MixNMatchersFrom, AsymmetricMixNMatchersFrom } from "mix-n-matchers";\n\nconst matchers = {\n  exactly,\n  enum: ofEnum,\n};\n\nexpect.extend(matchers);\n\ndeclare module "@jest/expect" {\n  interface Matchers<R, T> extends MixNMatchersFrom<typeof matchers, R, T> {}\n  interface AsymmetricMatchers\n    extends AsymmetricMixNMatchersFrom<typeof matchers> {\n    enum: AsymmetricMatchers["ofEnum"];\n  }\n}\n\n'})})}),(0,r.jsx)(o.A,{value:"Vitest",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport { expect } from "vitest";\nimport { exactly, ofEnum } from "mix-n-matchers";\nimport type { MixNMatchersFrom, AsymmetricMixNMatchersFrom } from "mix-n-matchers";\n\nconst matchers = {\n  exactly,\n  enum: ofEnum,\n};\n\nexpect.extend(matchers);\n\ndeclare module "vitest" {\n  interface Assertion<T> extends MixNMatchersFrom<typeof matchers, void, T> {}\n  interface AsymmetricMatchersContaining\n    extends AsymmetricMixNMatchersFrom<typeof matchers> {\n    enum: AsymmetricMatchers["ofEnum"];\n  }\n}\n\n'})})})]}),(0,r.jsxs)(t.p,{children:["After this setup, you should be able to use ",(0,r.jsx)(t.code,{children:"expect.enum"})," as a matcher."]}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"expect(mock).toBeCalledWith(expect.enum(MyEnum));\n"})}),(0,r.jsxs)(t.p,{children:["This is automatically done for you with the ",(0,r.jsx)(t.a,{href:"/#automatic-setup",children:"auto-setup files"}),"."]})]})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},2491:(e,t,n)=>{n.d(t,{A:()=>i});n(3696);var r=n(1750);const s={tabItem:"tabItem_wHwb"};var a=n(2540);function i(e){let{children:t,hidden:n,className:i}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,r.A)(s.tabItem,i),hidden:n,children:t})}},8296:(e,t,n)=>{n.d(t,{A:()=>E});var r=n(3696),s=n(1750),a=n(766),i=n(9519),o=n(4395),c=n(5043),u=n(4544),l=n(8708);function m(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function d(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return m(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:s}}=e;return{value:t,label:n,attributes:r,default:s}}))}(n);return function(e){const t=(0,u.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:n}=e;const s=(0,i.W6)(),a=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c.aZ)(a),(0,r.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(s.location.search);t.set(a,e),s.replace({...s.location,search:t.toString()})}),[a,s])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:s}=e,a=d(e),[i,c]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:a}))),[u,m]=p({queryString:n,groupId:s}),[f,x]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,a]=(0,l.Dv)(n);return[s,(0,r.useCallback)((e=>{n&&a.set(e)}),[n,a])]}({groupId:s}),b=(()=>{const e=u??f;return h({value:e,tabValues:a})?e:null})();(0,o.A)((()=>{b&&c(b)}),[b]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);c(e),m(e),x(e)}),[m,x,a]),tabValues:a}}var x=n(6681);const b={tabList:"tabList_J5MA",tabItem:"tabItem_l0OV"};var y=n(2540);function v(e){let{className:t,block:n,selectedValue:r,selectValue:i,tabValues:o}=e;const c=[],{blockElementScrollPositionUntilNextRender:u}=(0,a.a_)(),l=e=>{const t=e.currentTarget,n=c.indexOf(t),s=o[n].value;s!==r&&(u(t),i(s))},m=e=>{let t=null;switch(e.key){case"Enter":l(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:a}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>c.push(e),onKeyDown:m,onClick:l,...a,className:(0,s.A)("tabs__item",b.tabItem,a?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function g(e){let{lazy:t,children:n,selectedValue:s}=e;const a=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=a.find((e=>e.props.value===s));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:a.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function j(e){const t=f(e);return(0,y.jsxs)("div",{className:(0,s.A)("tabs-container",b.tabList),children:[(0,y.jsx)(v,{...t,...e}),(0,y.jsx)(g,{...t,...e})]})}function E(e){const t=(0,x.A)();return(0,y.jsx)(j,{...e,children:m(e.children)},String(t))}}}]);