import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import React from "react";
import { useColorMode } from "@docusaurus/theme-common";
import { githubLight, dracula } from "@codesandbox/sandpack-themes";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  export interface CSSProperties {
    [variable: `--${string}`]: string | number;
  }
}

export const TestFile: React.FC<{ name: string; children: string }> = ({
  name,
  children,
}) => {
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? dracula : githubLight;
  return (
    <SandpackProvider
      style={{ "--sp-layout-height": "350px" }}
      theme={{
        ...theme,
        font: {
          body: "var(--ifm-font-family-base)",
          mono: "var(--ifm-font-family-monospace)",
          size: "var(--ifm-code-font-size)",
          lineHeight: "var(--ifm-pre-line-height)",
        },
      }}
      customSetup={{
        entry: "entry.js",
        dependencies: { "mix-n-matchers": "^1" },
      }}
      files={{
        "/entry.ts": {
          code: "",
          hidden: true,
        },
        "/setup.test.ts": {
          code: `import "mix-n-matchers/all";`,
          hidden: true,
        },
        [`/${name}.test.ts`]: children,
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor showTabs />
        <SandpackTests style={{ minHeight: 200 }} />
      </SandpackLayout>
    </SandpackProvider>
  );
};
