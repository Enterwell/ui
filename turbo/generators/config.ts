import type { PlopTypes } from "@turbo/gen";
import camelCase from 'just-camel-case';
import pascalCase from 'just-pascal-case';

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

function hookTemplate(packageName: string) {
  return {
    description: "Adds a new hook",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the hook (eg. 'useSomething')?",
      },
    ],
    actions: [
      // UI Library
      {
        type: "add",
        path: `packages/${packageName}/hooks/{{camelCase name}}.ts`,
        templateFile: `templates/hook.hbs`,
      },
      {
        type: "append",
        path: `packages/${packageName}/index.ts`,
        pattern: /(?<insertion>\/\/ hook exports)/g,
        template: 'export * from "./hooks/{{camelCase name}}";',
      },
      // Docs
      {
        type: "add",
        path: "apps/docs/components/Example{{pascalCase name}}.tsx",
        templateFile: "templates/hookDocsExample.hbs",
      },
      {
        type: "add",
        path: `apps/docs/pages/${packageName}/hooks/{{kebabCase name}}.mdx`,
        templateFile: `templates/${packageName.substring(0, packageName.length - 1)}DocsPage.hbs`,
      },
      // Changelog
      {
        type: 'modify',
        path: `packages/${packageName}/.changelog.json`,
        transform: (content: string, data: any) => {
          const hookName = camelCase(data.name);

          const parsedConfiguration = JSON.parse(content);
          parsedConfiguration.categories.push(hookName);

          return JSON.stringify(parsedConfiguration, null, 2);
        }
      },
      {
        type: "add",
        path: `packages/${packageName}/changes/Added [{{camelCase name}}] Hook`,
      }
    ],
  }
}

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
        path: "packages/react-ui/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
      {
        type: "add",
        path: "packages/react-ui/{{pascalCase name}}/index.tsx",
        templateFile: "templates/componentIndex.hbs",
      },
      {
        type: "append",
        path: "packages/react-ui/index.tsx",
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
        path: "apps/docs/pages/react-ui/components/{{kebabCase name}}.mdx",
        templateFile: "templates/componentDocsPage.hbs",
      },
      // Changelog
      {
        type: 'modify',
        path: 'packages/react-ui/.changelog.json',
        transform: (content: string, data: any) => {
          const componentName = pascalCase(data.name);

          const parsedConfiguration = JSON.parse(content);
          parsedConfiguration.categories.push(componentName);

          return JSON.stringify(parsedConfiguration, null, 2);
        }
      },
      {
        type: "add",
        path: "packages/react-ui/changes/Added [{{pascalCase name}}] Component",
      }
    ],
  });
  plop.setGenerator("react-hook", hookTemplate("react-hooks"));
  plop.setGenerator("react-mui-hook", hookTemplate("react-mui-hooks"));
}
