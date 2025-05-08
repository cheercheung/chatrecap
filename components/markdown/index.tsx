"use client";

import "./markdown.css";
import React from "react";

// Simple markdown renderer that doesn't rely on complex libraries
export default function Markdown({ content }: { content: string }) {
  // Basic processing for markdown
  const processedContent = content
    // Headers
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Blockquotes - Add support for > syntax
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Horizontal Rule - Add support for --- (horizontal line)
    .replace(/^\s*-{3,}\s*$/gim, '<hr class="markdown-hr" />')
    // Lists
    .replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>')
    .replace(/^\* (.*)/gim, '<li>$1</li>')
    .replace(/^\s*\n- (.*)/gim, '<ul>\n<li>$1</li>')
    .replace(/^- (.*)/gim, '<li>$1</li>')
    // Code blocks - simplified
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
    })
    // Line breaks
    .replace(/\n/gim, '<br>');

  return (
    <div
      className="max-w-full overflow-x-auto markdown"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
