import fs from "fs"
import path from "path"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

function docsComponentSourceFilePath(name) {
  return `components/${name}.tsx`
}

function readComponentSourceFiles(relativePaths) {
  if (!Array.isArray(relativePaths)) {
    relativePaths = [relativePaths]
  }

  // Try to read file from relative paths (first one that exists)
  for (const relativePath of relativePaths) {
    try {
      const filePath = path.join(process.cwd(), relativePath)
      return { path: relativePath, source: fs.readFileSync(filePath, "utf8") };
    } catch (error) {
      // Ignore error
    }
  }

  return { path: null, source: null };
}

function highlightCode(source) {
  if (!source) return;

  // Extract highted sections (when containing "// @highlight-start" and "// @highlight-end" comments")
  const highlightedRange = [];
  const codeLines = source.split("\n");
  let highlightStart = null;
  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i];
    if (line.includes("// @highlight-start")) {
      highlightStart = i;
    } else if (line.includes("// @highlight-end")) {
      highlightedRange.push(`${highlightStart + 1}-${i - 1}`);

      // Remove hightlight comments
      codeLines.splice(highlightStart, 1);
      codeLines.splice(i - 1, 1);

      highlightStart = null;
    }
  }

  return {
    codeLines,
    highlightedRange
  };
}

function pushChildCodeBlock(node, codeLines, src, highlightedRange) {
  node.children?.push(
    u("element", {
      tagName: "pre",
      properties: {
        __src__: src,
      },
      children: [
        u("element", {
          tagName: "code",
          properties: {
            className: ["language-tsx"],
          },
          children: [
            {
              type: "text",
              value: codeLines.join("\n"),
            },
          ],
          data: { meta: `filename="${src}" {${highlightedRange.join(",")}} showLineNumbers` },
        }),
      ],
    })
  );
}

function handleComponentWithSource(node) {
  if (node.name === "ComponentWithSource") {
    const component = getNodeAttributeByName(node, "component")?.value;
    const name = component?.value;

    if (!name) {
      return JSON.stringify(component);
    }

    try {
      // Read the source file.
      const src = docsComponentSourceFilePath(name.trim());
      const { path, source } = readComponentSourceFiles(src);

      const { codeLines, highlightedRange } = highlightCode(source);

      pushChildCodeBlock(node, codeLines, path.replace("../..", ""), highlightedRange);
    } catch (error) {
      console.error(error)
    }
  }
}

function handleComponentSource(node) {
  if (node.name === "ComponentSource") {
    const name = getNodeAttributeByName(node, "name")?.value;
    const directory = getNodeAttributeByName(node, "directory")?.value;
    const importPackageName = getNodeAttributeByName(node, "package")?.value;

    // importPackage is prefixed with "@enterwell/" (npm namespace)
    const packageName = importPackageName?.replace("@enterwell/", "");

    try {
      // Read the source file
      const src = `../../packages/${packageName}/${directory}/${name}.ts`;
      const srcAlt = `../../packages/${packageName}/${directory}/${name}.tsx`;
      const { path, source } = readComponentSourceFiles([src, srcAlt]);

      const { codeLines, highlightedRange } = highlightCode(source);

      pushChildCodeBlock(node, codeLines, path.replace("../..", ""), highlightedRange);
    } catch (error) {
      console.error(error)
    }
  }
}

export function rehypeComponent() {
  return async (tree) => {
    visit(tree, (node) => {
      handleComponentWithSource(node);
      handleComponentSource(node);
    })
  }
}

function getNodeAttributeByName(node, name) {
  return node.attributes?.find((attribute) => attribute.name === name)
}