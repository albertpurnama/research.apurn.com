import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BookOpen, FileText, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FileInfo {
	relativePath: string;
	slug: string;
	filename: string;
}

function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-6">
			{/* Main Content */}
			<div className="max-w-2xl text-center space-y-8">
				{/* Icon */}
				<div className="flex justify-center">
					<div className="p-4 rounded-full bg-card border border-border">
						<BookOpen className="w-12 h-12 text-primary" />
					</div>
				</div>

				{/* Heading */}
				<div className="space-y-4">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
						Research Archive
					</h1>
					<p className="text-xl text-muted-foreground">
						A collection of notes, research, and ideas organized for easy
						discovery
					</p>
				</div>

				{/* Features */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
					<div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
						<Search className="w-6 h-6 text-primary mx-auto mb-3" />
						<h3 className="font-semibold text-foreground mb-2">Search</h3>
						<p className="text-sm text-muted-foreground">
							Quickly find documents using the search bar in the sidebar
						</p>
					</div>

					<div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
						<FileText className="w-6 h-6 text-primary mx-auto mb-3" />
						<h3 className="font-semibold text-foreground mb-2">Documents</h3>
						<p className="text-sm text-muted-foreground">
							Browse through all your research documents organized
							alphabetically
						</p>
					</div>

					<div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
						<BookOpen className="w-6 h-6 text-primary mx-auto mb-3" />
						<h3 className="font-semibold text-foreground mb-2">Markdown</h3>
						<p className="text-sm text-muted-foreground">
							All documents are beautifully formatted with full markdown support
						</p>
					</div>
				</div>

				{/* Getting Started */}
				<div className="bg-card border border-border rounded-lg p-8 text-left">
					<h2 className="text-xl font-semibold text-foreground mb-4">
						Getting Started
					</h2>
					<ol className="space-y-3 text-muted-foreground">
						<li className="flex gap-3">
							<span className="text-primary font-semibold">1</span>
							<span>
								Open the search sidebar on the left to view all documents
							</span>
						</li>
						<li className="flex gap-3">
							<span className="text-primary font-semibold">2</span>
							<span>Use the search bar to filter documents by name</span>
						</li>
						<li className="flex gap-3">
							<span className="text-primary font-semibold">3</span>
							<span>Click on any document to read its full content</span>
						</li>
						<li className="flex gap-3">
							<span className="text-primary font-semibold">4</span>
							<span>Your documents sync with Obsidian automatically</span>
						</li>
					</ol>
				</div>

				{/* Footer */}
				<p className="text-sm text-muted-foreground">
					Connected to your local research archive
				</p>
			</div>
		</div>
	);
}

function slugify(filename: string): string {
	return filename
		.replace(".md", "")
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]/g, "");
}

function getAllFiles(dir: string, baseDir: string): FileInfo[] {
	const files: FileInfo[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		// Skip hidden files
		if (entry.name.startsWith(".")) continue;

		const fullPath = path.join(dir, entry.name);
		const relativePath = path.relative(baseDir, fullPath);

		if (entry.isDirectory()) {
			files.push(...getAllFiles(fullPath, baseDir));
		} else if (entry.name.endsWith(".md")) {
			const filename = entry.name.replace(".md", "");
			let folder = path.dirname(relativePath);
			const isRoot = folder === ".";

			// Strip "Arcadia" prefix from folder path (treat Arcadia folder as transparent)
			if (folder.startsWith(`Arcadia${path.sep}`)) {
				folder = folder.substring(`Arcadia${path.sep}`.length);
			} else if (folder === "Arcadia") {
				folder = ".";
			}

			const isTrueRoot = isRoot || folder === ".";

			files.push({
				relativePath,
				slug: isTrueRoot
					? slugify(filename)
					: `${folder.split(path.sep).map(slugify).join("/")}/${slugify(filename)}`,
				filename,
			});
		}
	}

	return files;
}

export async function generateStaticParams() {
	const markdownFolder = process.env.MARKDOWN_FOLDER || "app/arcadia";
	const markdownPath = path.join(process.cwd(), markdownFolder);
	
	// Handle missing directory gracefully
	if (!fs.existsSync(markdownPath)) {
		return [{ slug: [] }];
	}
	
	let files = getAllFiles(markdownPath, markdownPath);

	// Deduplicate by slug (keep first occurrence)
	const seenSlugs = new Set<string>();
	files = files.filter((file) => {
		if (seenSlugs.has(file.slug)) {
			return false;
		}
		seenSlugs.add(file.slug);
		return true;
	});

	// Generate params for all files
	const fileParams = files.map((file) => ({
		slug: file.slug.split("/"),
	}));

	// Add home page param (empty slug array for optional catch-all)
	return [{ slug: [] }, ...fileParams];
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}) {
	const { slug } = await params;

	// If no slug, show home page
	if (!slug || slug.length === 0) {
		return <Home />;
	}

	const slugString = slug.join("/");
	const markdownFolder = process.env.MARKDOWN_FOLDER || "app/arcadia";
	const markdownPath = path.join(process.cwd(), markdownFolder);
	let files = getAllFiles(markdownPath, markdownPath);

	// Deduplicate by slug (keep first occurrence)
	const seenSlugs = new Set<string>();
	files = files.filter((file) => {
		if (seenSlugs.has(file.slug)) {
			return false;
		}
		seenSlugs.add(file.slug);
		return true;
	});

	// Find the matching file
	const matchingFile = files.find((file) => file.slug === slugString);

	if (!matchingFile) {
		return (
			<div className="p-8 bg-background">
				<h1 className="text-2xl font-bold text-foreground">Page not found</h1>
				<p className="text-muted-foreground">
					Could not find document: {slugString}
				</p>
			</div>
		);
	}

	const filePath = path.join(markdownPath, matchingFile.relativePath);
	const content = fs.readFileSync(filePath, "utf-8");
	const { data, content: markdown } = matter(content);

	return (
		<div className="w-full bg-background text-foreground min-h-screen py-12">
			<article className="max-w-3xl mx-auto px-8">
				<h1 className="text-4xl font-bold text-foreground mb-8">
					{data.title || matchingFile.filename}
				</h1>
				<div className="max-w-none">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							h1: ({ node, ...props }) => (
								<h1
									className="text-3xl font-bold text-foreground mt-8 mb-4"
									{...props}
								/>
							),
							h2: ({ node, ...props }) => (
								<h2
									className="text-2xl font-bold text-foreground mt-6 mb-3"
									{...props}
								/>
							),
							h3: ({ node, ...props }) => (
								<h3
									className="text-xl font-bold text-foreground mt-4 mb-2"
									{...props}
								/>
							),
							p: ({ node, ...props }) => (
								<p
									className="text-foreground/80 leading-relaxed mb-4"
									{...props}
								/>
							),
							a: ({ node, ...props }) => (
								<a
									className="text-primary hover:text-primary/80 underline"
									{...props}
								/>
							),
							ul: ({ node, ...props }) => (
								<ul
									className="list-disc list-inside text-foreground/80 mb-4"
									{...props}
								/>
							),
							ol: ({ node, ...props }) => (
								<ol
									className="list-decimal list-inside text-foreground/80 mb-4"
									{...props}
								/>
							),
							li: ({ node, ...props }) => (
								<li className="text-foreground/80 mb-2" {...props} />
							),
							blockquote: ({ node, ...props }) => (
								<blockquote
									className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
									{...props}
								/>
							),
							code: ({ node, ...props }) => (
								<code
									className="bg-card text-foreground px-2 py-1 rounded text-sm border border-border"
									{...props}
								/>
							),
							pre: ({ node, ...props }) => (
								<pre
									className="bg-card text-foreground p-4 rounded-lg overflow-x-auto mb-4 border border-border"
									{...props}
								/>
							),
							table: ({ node, ...props }) => (
								<table
									className="w-full border-collapse border border-border mb-4"
									{...props}
								/>
							),
							thead: ({ node, ...props }) => (
								<thead className="bg-card" {...props} />
							),
							th: ({ node, ...props }) => (
								<th
									className="border border-border px-4 py-2 text-left text-foreground"
									{...props}
								/>
							),
							td: ({ node, ...props }) => (
								<td
									className="border border-border px-4 py-2 text-foreground/80"
									{...props}
								/>
							),
						}}
					>
						{markdown}
					</ReactMarkdown>
				</div>
			</article>
		</div>
	);
}
