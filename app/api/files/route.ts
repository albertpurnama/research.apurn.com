import fs from "fs";
import path from "path";

interface MarkdownFile {
  filename: string;
  slug: string;
  folder?: string;
}

function slugify(filename: string): string {
  return filename
    .replace(".md", "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function getFilesRecursive(dir: string, baseDir: string): MarkdownFile[] {
  const files: MarkdownFile[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files and node_modules
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      files.push(...getFilesRecursive(fullPath, baseDir));
    } else if (entry.name.endsWith(".md")) {
      const filename = entry.name.replace(".md", "");
      const folder = path.dirname(relativePath);
      const isRoot = folder === ".";
      let folderPath = folder.split(path.sep).join("/");

      // Skip .obsidian and other Obsidian-specific files
      if (folderPath.startsWith(".obsidian")) return;

      // Strip "Arcadia" prefix from folder path (treat Arcadia folder as transparent)
      if (folderPath.startsWith("Arcadia/")) {
        folderPath = folderPath.substring("Arcadia/".length);
      } else if (folderPath === "Arcadia") {
        folderPath = ".";
      }

      const isTrueRoot = isRoot || folderPath === ".";

      files.push({
        filename,
        slug: isTrueRoot
          ? slugify(filename)
          : `${folderPath.split("/").map(slugify).join("/")}/${slugify(filename)}`,
        folder: isTrueRoot ? undefined : folderPath,
      });
    }
  }

  return files;
}

export async function GET() {
  const markdownFolder = process.env.MARKDOWN_FOLDER || "app/arcadia";
  const markdownPath = path.join(process.cwd(), markdownFolder);

  try {
    let files = getFilesRecursive(markdownPath, markdownPath);

    // Deduplicate by slug (keep first occurrence)
    const seenSlugs = new Set<string>();
    files = files.filter((file) => {
      if (seenSlugs.has(file.slug)) {
        return false;
      }
      seenSlugs.add(file.slug);
      return true;
    });

    files = files.sort((a, b) => {
      const aFolder = a.folder || "";
      const bFolder = b.folder || "";
      const folderCompare = aFolder.localeCompare(bFolder);
      if (folderCompare !== 0) return folderCompare;
      return a.filename.localeCompare(b.filename);
    });

    return Response.json(files);
  } catch (error) {
    return Response.json(
      { error: "Failed to read files" },
      { status: 500 }
    );
  }
}
