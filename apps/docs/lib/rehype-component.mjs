import fs from "fs"
import path from "path"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

function componentSourceFilePath(name) {
  return `components/${name}.tsx`
}

function readComponentSourceFiles(name) {
  // Read the source file.
  let src = componentSourceFilePath(name);
  const filePath = path.join(process.cwd(), src)
  return fs.readFileSync(filePath, "utf8")
}

function handleComponentSource(node) {
  if (node.name === "ComponentWithSource") {
    const component = getNodeAttributeByName(node, "component")?.value;
    const name = component?.value;

    if (!name) {
      return JSON.stringify(component);
    }

    try {
      // Read the source file.
      const src = componentSourceFilePath(name);
      const source = readComponentSourceFiles(name);

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

      console.log('ranges', highlightedRange)

      // Add code as children so that rehype can take over at build time.
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
      )
    } catch (error) {
      console.error(error)
    }
  }
}

export function rehypeComponent() {
  return async (tree) => {
    visit(tree, (node) => {
      handleComponentSource(node);
    })
  }
}

function getNodeAttributeByName(node, name) {
  return node.attributes?.find((attribute) => attribute.name === name)
}