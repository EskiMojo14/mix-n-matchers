"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[199],{4269:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>c,default:()=>m,frontMatter:()=>l,metadata:()=>o,toc:()=>h});var s=n(2540),a=n(3023),r=n(8296),i=n(2491);const l={sidebar_position:1,slug:"/"},c="Setup",o={id:"setup",title:"Setup",description:"Mix 'n' Matchers is a set of custom Jest matchers, aiming to fill perceived gaps in the Jest matcher ecosystem. This guide will help you get started.",source:"@site/docs/setup.mdx",sourceDirName:".",slug:"/",permalink:"/mix-n-matchers/",draft:!1,unlisted:!1,editUrl:"https://github.com/EskiMojo14/mix-n-matchers/tree/main/website/docs/setup.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,slug:"/"},sidebar:"docs",next:{title:"expect.exactly(value)",permalink:"/mix-n-matchers/matchers/exactly"}},u={},h=[{value:"Installation",id:"installation",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Automatic setup",id:"automatic-setup",level:3},{value:"Manual setup",id:"manual-setup",level:3}];function d(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"setup",children:"Setup"}),"\n",(0,s.jsx)(t.p,{children:"Mix 'n' Matchers is a set of custom Jest matchers, aiming to fill perceived gaps in the Jest matcher ecosystem. This guide will help you get started."}),"\n",(0,s.jsx)(t.h2,{id:"installation",children:"Installation"}),"\n",(0,s.jsx)(t.p,{children:"Install with your package manager of choice:"}),"\n","\n",(0,s.jsxs)(r.A,{groupId:"package-manager",children:[(0,s.jsx)(i.A,{value:"npm",default:!0,children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"\nnpm install -D mix-n-matchers\n\n"})})}),(0,s.jsx)(i.A,{value:"yarn",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"\nyarn add -D mix-n-matchers\n\n"})})}),(0,s.jsx)(i.A,{value:"bun",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"\nbun add -D mix-n-matchers\n\n"})})})]}),"\n",(0,s.jsx)(t.h2,{id:"configuration",children:"Configuration"}),"\n",(0,s.jsx)(t.h3,{id:"automatic-setup",children:"Automatic setup"}),"\n",(0,s.jsx)(t.p,{children:"The easiest way to add the matchers to your environment is by importing one of the automatic setup files, which will add all of the matchers for you."}),"\n",(0,s.jsx)(t.p,{children:"Import one of these into a setup file, and include that setup file in your Jest/Vitest configuration. Using this setup will also ensure that the matchers are available in your TypeScript files."}),"\n",(0,s.jsxs)(r.A,{groupId:"test-runner",children:[(0,s.jsxs)(i.A,{value:"Jest",default:!0,children:[(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport "mix-n-matchers/all";\n\n'})}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="jest.config.ts"',children:"\nimport type { Config } from 'jest';\n\nconst config: Config = {\n  setupFilesAfterEnv: [\"<rootDir>/test-setup.ts\"]\n};\n\nexport default config;\n\n"})})]}),(0,s.jsxs)(i.A,{value:"Jest (no globals)",children:[(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport "mix-n-matchers/jest-globals";\n\n'})}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="jest.config.ts"',children:"\nimport type { Config } from 'jest';\n\nconst config: Config = {\n  injectGlobals: false,\n  setupFilesAfterEnv: [\"<rootDir>/test-setup.ts\"]\n};\n\nexport default config;\n\n"})})]}),(0,s.jsxs)(i.A,{value:"Vitest",children:[(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport "mix-n-matchers/vitest";\n\n'})}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="vitest.config.ts"',children:'\nexport default defineConfig({\n  test: {\n    setupFiles: ["./test-setup.ts"],\n  },\n})\n\n'})})]})]}),"\n",(0,s.jsx)(t.h3,{id:"manual-setup",children:"Manual setup"}),"\n",(0,s.jsx)(t.p,{children:"If you'd prefer to add the matchers manually, you can import the individual matchers as needed into your setup file."}),"\n",(0,s.jsxs)(r.A,{groupId:"test-runner",children:[(0,s.jsx)(i.A,{value:"Jest",default:!0,children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'import {\n  toBeCalledWithContext,\n  lastCalledWithContext,\n  nthCalledWithContext,\n  exactly,\n} from "mix-n-matchers";\nimport type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";\n\nconst matchers = {\n  toBeCalledWithContext,\n  lastCalledWithContext,\n  nthCalledWithContext,\n  exactly,\n};\n\nexpect.extend(matchers);\n\ndeclare global {\n  namespace jest {\n    interface Matchers<R, T>\n      extends Pick<\n        MixNMatchers<R, T>,\n        keyof typeof matchers & keyof MixNMatchers<R, T>\n      > {}\n\n    interface Expect\n      extends Pick<\n        AsymmetricMixNMatchers,\n        keyof typeof matchers & keyof AsymmetricMixNMatchers\n      > {}\n\n    interface InverseAsymmetricMatchers\n      extends Pick<\n        AsymmetricMixNMatchers,\n        keyof typeof matchers & keyof AsymmetricMixNMatchers\n      > {}\n  }\n}\n\n'})})}),(0,s.jsx)(i.A,{value:"Jest (no globals)",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport { expect } from "@jest/globals";\nimport {\n  toBeCalledWithContext,\n  lastCalledWithContext,\n  nthCalledWithContext,\n  exactly,\n} from "mix-n-matchers";\nimport type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";\n\nconst matchers = {\n  toBeCalledWithContext,\n  lastCalledWithContext,\n  nthCalledWithContext,\n  exactly,\n};\n\nexpect.extend(matchers);\n\ndeclare module "@jest/expect" {\n  interface Matchers<R, T>\n    extends Pick<\n      MixNMatchers<R, T>,\n      keyof typeof matchers & keyof MixNMatchers<R, T>\n    > {}\n  interface AsymmetricMatchers\n    extends Pick<\n      AsymmetricMixNMatchers,\n      keyof typeof matchers & keyof AsymmetricMixNMatchers\n    > {}\n}\n\n'})})}),(0,s.jsx)(i.A,{value:"Vitest",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:'title="test-setup.ts"',children:'\nimport { expect } from "vitest";\nimport {\n  toBeCalledWithContext,\n  lastCalledWithContext,\n  nthCalledWithContext,\n  exactly,\n} from "mix-n-matchers";\nimport type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";\n\nconst matchers = {\n  toBeCalledWithContext,\n  lastCalledWithContext,\n  nthCalledWithContext,\n  exactly,\n};\n\nexpect.extend(matchers);\n\ndeclare module "vitest" {\n  interface Assertion<T>\n    extends Pick<\n      MixNMatchers<void, T>,\n      keyof typeof matchers & keyof MixNMatchers<void, T>\n    > {}\n  interface AsymmetricMatchersContaining\n    extends Pick<\n      AsymmetricMixNMatchers,\n      keyof typeof matchers & keyof AsymmetricMixNMatchers\n    > {}\n}\n\n'})})})]}),"\n",(0,s.jsxs)(t.admonition,{title:"Asymmetric Matchers vs Symmetric Matchers",type:"note",children:[(0,s.jsxs)(t.p,{children:["When ",(0,s.jsx)(t.code,{children:"expect.extend"})," is called, each matcher is added as both an asymmetric and symmetric matcher."]}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:'expect.extend({\n  foo(received) {\n    const pass = received === "foo";\n    return {\n      pass,\n      message: pass ? () => "Expected \'foo\'" : () => "Expected not \'foo\'",\n    };\n  },\n});\n\nexpect(value).foo(); // symmetric\n\nexpect(value).toEqual(expect.foo()); // asymmetric\n'})}),(0,s.jsxs)(t.p,{children:["However, conventionally there is a difference in how these matchers are named. For example, ",(0,s.jsx)(t.code,{children:".toBeAnArray()"})," vs ",(0,s.jsx)(t.code,{children:"expect.array()"}),"."]}),(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"mix-n-matchers"})," intentionally only exposes types for matchers as ",(0,s.jsx)(t.em,{children:"either"})," asymmetric or symmetric, and not both. Sometimes a matcher is available as both, but with different names. For example, ",(0,s.jsxs)(t.a,{href:"/matchers/enums",children:[(0,s.jsx)(t.code,{children:".toBeEnum()"})," and ",(0,s.jsx)(t.code,{children:"expect.ofEnum"})]}),"."]}),(0,s.jsx)(t.p,{children:"This helps to avoid confusion and makes it clear which matchers are designed to be asymmetric and which are symmetric."}),(0,s.jsx)(t.p,{children:"If there's any existing matchers that are only available as asymmetric matchers and you'd like to use them as symmetric matchers (or vice versa), please open an issue or a pull request!"}),(0,s.jsx)(t.p,{children:"You can of course choose to expose these types yourself to enable both symmetric and asymmetric usage of a matcher."}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:'declare module "mix-n-matchers" {\n  interface MixNMatchers<R, T> extends Pick<AsymmetricMixNMatchers, "typeOf"> {}\n  interface AsymmetricMixNMatchers\n    extends Pick<MixNMatchers<any, any>, "toBeCalledWithContext"> {}\n}\n\n// now allowed\nexpect(value).typeOf("string");\nexpect(value).toEqual({ fn: expect.toBeCalledWithContext(context) });\n'})})]})]})}function m(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},2491:(e,t,n)=>{n.d(t,{A:()=>i});n(3696);var s=n(1750);const a={tabItem:"tabItem_wHwb"};var r=n(2540);function i(e){let{children:t,hidden:n,className:i}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(a.tabItem,i),hidden:n,children:t})}},8296:(e,t,n)=>{n.d(t,{A:()=>M});var s=n(3696),a=n(1750),r=n(766),i=n(9519),l=n(4395),c=n(5043),o=n(4544),u=n(8708);function h(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function d(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return h(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:a}}=e;return{value:t,label:n,attributes:s,default:a}}))}(n);return function(e){const t=(0,o.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:n}=e;const a=(0,i.W6)(),r=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(a.location.search);t.set(r,e),a.replace({...a.location,search:t.toString()})}),[r,a])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,r=d(e),[i,c]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:r}))),[o,h]=p({queryString:n,groupId:a}),[x,f]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,r]=(0,u.Dv)(n);return[a,(0,s.useCallback)((e=>{n&&r.set(e)}),[n,r])]}({groupId:a}),y=(()=>{const e=o??x;return m({value:e,tabValues:r})?e:null})();(0,l.A)((()=>{y&&c(y)}),[y]);return{selectedValue:i,selectValue:(0,s.useCallback)((e=>{if(!m({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);c(e),h(e),f(e)}),[h,f,r]),tabValues:r}}var f=n(6681);const y={tabList:"tabList_J5MA",tabItem:"tabItem_l0OV"};var g=n(2540);function b(e){let{className:t,block:n,selectedValue:s,selectValue:i,tabValues:l}=e;const c=[],{blockElementScrollPositionUntilNextRender:o}=(0,r.a_)(),u=e=>{const t=e.currentTarget,n=c.indexOf(t),a=l[n].value;a!==s&&(o(t),i(a))},h=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":n},t),children:l.map((e=>{let{value:t,label:n,attributes:r}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>c.push(e),onKeyDown:h,onClick:u,...r,className:(0,a.A)("tabs__item",y.tabItem,r?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function v(e){let{lazy:t,children:n,selectedValue:a}=e;const r=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=r.find((e=>e.props.value===a));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:r.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==a})))})}function j(e){const t=x(e);return(0,g.jsxs)("div",{className:(0,a.A)("tabs-container",y.tabList),children:[(0,g.jsx)(b,{...t,...e}),(0,g.jsx)(v,{...t,...e})]})}function M(e){const t=(0,f.A)();return(0,g.jsx)(j,{...e,children:h(e.children)},String(t))}}}]);