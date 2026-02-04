/**
 * [Markdown utilities]
 * Helper functions for parsing markdown syntax in AI responses
 */

/**
 * Parse markdown bold syntax (**text**) into React elements
 * @param text - Text that may contain **bold** markdown syntax
 * @returns Array of React elements (strings and strong elements)
 */
export function parseBoldMarkdown(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the bold text
    parts.push(
      <strong key={key++} className="font-semibold text-[var(--accent-11)]">
        {match[1]}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no matches found, return the original text
  return parts.length > 0 ? parts : [text];
}
