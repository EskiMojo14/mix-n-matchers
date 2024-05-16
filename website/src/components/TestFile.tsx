import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import React from "react";
import { useColorMode } from "@docusaurus/theme-common";
import { githubLight, dracula } from "@codesandbox/sandpack-themes";

const setup = `import "mix-n-matchers/all";`;

export const TestFile: React.FC<{ name: string; children: string }> = ({
  name,
  children,
}) => {
  const { colorMode } = useColorMode();
  return (
    <SandpackProvider
      theme={colorMode === "dark" ? dracula : githubLight}
      customSetup={{
        entry: "entry.js",
        dependencies: { "mix-n-matchers": "^1" },
      }}
      files={{
        "/entry.ts": {
          code: "",
          hidden: true,
        },
        "/extended.test.ts": {
          code: setup,
          hidden: true,
        },
        [`/${name}.test.ts`]: children,
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor showTabs />
        <SandpackTests style={{ minHeight: 150 }} />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const ts = String.raw;
