import { marked } from 'marked';
import DOMPurify from 'dompurify';

const renderer = new marked.Renderer();

renderer.table = function ({ header, rows }) {
  let html = '<div class="table-wrap"><table>';
  html += '<thead><tr>';
  for (const cell of header) {
    html += `<th${cell.align ? ` style="text-align:${cell.align}"` : ''}>${cell.text}</th>`;
  }
  html += '</tr></thead>';
  html += '<tbody>';
  for (const row of rows) {
    html += '<tr>';
    for (const cell of row) {
      html += `<td${cell.align ? ` style="text-align:${cell.align}"` : ''}>${cell.text}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table></div>';
  return html;
};

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer,
});

export function renderMarkdown(text) {
  if (!text) return '';
  const raw = marked.parse(text);
  const clean = DOMPurify.sanitize(raw, {
    ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  });
  return `<div class="bubble-content">${clean}</div>`;
}
