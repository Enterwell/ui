import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

// eslint-disable-next-line import/no-default-export -- Turbo generators require default export
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("component", {
    description: "Adds a new component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
      },
    ],
    actions: [
      // UI Library
      {
        type: "add",
        path: "packages/ui/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{pascalCase name}}/index.tsx",
        templateFile: "templates/componentIndex.hbs",
      },
      {
        type: "append",
        path: "packages/ui/index.tsx",
        pattern: /(?<insertion>\/\/ component exports)/g,
        template: 'export * from "./{{pascalCase name}}";',
      },
      // Docs
      {
        type: "add",
        path: "apps/docs/components/Example{{pascalCase name}}.tsx",
        templateFile: "templates/componentDocsExample.hbs",
      },
      {
        type: "add",
        path: "apps/docs/pages/ui/components/{{kebabCase name}}.mdx",
        templateFile: "templates/componentDocsPage.hbs",
      },
      {
        type: "append",
        path: "apps/docs/pages/ui/components/_meta.json",
        pattern: /(?<insertion>"\n)}/g,
        template: ',\n    "{{kebabCase name}}": "{{pascalCase name}}",\n',
      },
    ],
  });
}
