import { Plugin } from "obsidian";

export default class ToC extends Plugin {
  async onload(): Promise<void> {
    console.log("loading plugin");
  }

  onunload(): void {
    console.log("unloading plugin");
  }
}
