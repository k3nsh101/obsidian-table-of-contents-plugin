import { App, MarkdownView, Plugin } from "obsidian";

interface Heading {
  text: string;
  level: number;
}

export default class ToC extends Plugin {
  override async onload(): Promise<void> {
    this.addCommand({
      id: "add-table-of-content",
      name: "Insert table of content",
      editorCallback: (editor, view) => {
        if (!(view instanceof MarkdownView)) {
          return;
        }

        const content = getContent(this.app, view);
        const toc = makeCallout(content);
        editor.replaceRange(toc, { line: 0, ch: 0 });
      },
    });
  }

  override onunload(): void {
    console.log("unloading plugin");
  }
}

function getContent(app: App, view: MarkdownView): Heading[] {
  const file = view.file;

  if (!file) throw new Error("File not found on the view");

  const cache = app.metadataCache.getFileCache(file);

  if (!cache?.headings) throw new Error("No headings for the file");

  const content = cache?.headings.map((h) => ({
    text: h.heading,
    level: h.level,
  }));

  return content;
}

function makeCallout(headings: Heading[]) {
  const lines = [`> [!ABSTRACT]- Contents`];

  const stack: number[] = [];

  for (const heading of headings) {
    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (top === undefined || top < heading.level) break;

      stack.pop()
    }

    lines.push(`> ${"\t".repeat(stack.length)}- [[#${heading.text}]]`);

    stack.push(heading.level);
  }

  const callout = lines.join("\n");

  return `${callout}\n\n`;
}
