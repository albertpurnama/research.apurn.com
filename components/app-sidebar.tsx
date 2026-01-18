"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen, ChevronDown, Folder } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

interface MarkdownFile {
  filename: string;
  slug: string;
  folder?: string;
}

interface FolderGroup {
  [key: string]: MarkdownFile[];
}

export function AppSidebar() {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState<MarkdownFile[]>([]);
  const [folderGroups, setFolderGroups] = useState<FolderGroup>({});

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setFilteredFiles(data);
        groupFilesByFolder(data);
      });
  }, []);

  useEffect(() => {
    const filtered = files.filter((file) =>
      file.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
    groupFilesByFolder(filtered);
  }, [searchQuery, files]);

  function groupFilesByFolder(fileList: MarkdownFile[]) {
    const groups: FolderGroup = {};
    fileList.forEach((file) => {
      const folder = file.folder || "Root";
      if (!groups[folder]) {
        groups[folder] = [];
      }
      groups[folder].push(file);
    });
    setFolderGroups(groups);
  }

  const sortedFolders = Object.keys(folderGroups).sort((a, b) => {
    // Put Root (files at root level) at the end
    if (a === "Root") return 1;
    if (b === "Root") return -1;
    // Sort folders alphabetically
    return a.localeCompare(b);
  });

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        {/* Search Bar */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-sidebar-accent border-0"
            />
          </div>
        </div>

        {/* Documents List */}
        <SidebarGroup className="flex-1 overflow-y-auto">
          <SidebarGroupLabel className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Documents
          </SidebarGroupLabel>
          <SidebarMenu>
            {filteredFiles.length > 0 ? (
              sortedFolders.map((folder) => (
                <Collapsible
                  key={folder}
                  defaultOpen={folder === "Root" || searchQuery.length > 0}
                  className="group/collapsible"
                >
                  {folder === "Root" ? (
                    // Root folder - no collapsible
                    <>
                      {folderGroups[folder].map((file) => (
                        <SidebarMenuItem key={`${folder}-${file.slug}`}>
                          <SidebarMenuButton asChild>
                            <Link href={`/${file.slug}`} className="text-sm">
                              {file.filename}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </>
                  ) : (
                    // Nested folders - collapsible
                    <>
                      <SidebarMenuItem key={`folder-${folder}`}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            <span className="text-sm">{folder}</span>
                            <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </SidebarMenuItem>
                      <CollapsibleContent>
                        <SidebarMenu className="ml-4 border-l border-sidebar-border">
                          {folderGroups[folder].map((file) => (
                            <SidebarMenuItem key={`${folder}-${file.slug}`}>
                              <SidebarMenuButton asChild>
                                <Link href={`/${file.slug}`} className="text-sm">
                                  {file.filename}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </>
                  )}
                </Collapsible>
              ))
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                No documents found
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
