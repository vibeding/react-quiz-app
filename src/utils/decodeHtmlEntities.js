// The Open Trivia Database (OTDB) sends question/answer text with HTML
// entities encoded (for example: &quot; &#039; &amp;) so that special
// characters survive being embedded in JSON/HTML safely. Before we show
// that text to the user, we need to turn it back into normal characters
// (e.g. &quot; -> ", &#039; -> ').
export function decodeHtmlEntities(encodedText) {
  // Trick: create a <textarea> element that never gets added to the page,
  // set its innerHTML to the encoded text, then read .value back out.
  // The browser's own HTML parser does the entity decoding for us, so we
  // don't need to write (or import) a lookup table of every HTML entity.
  const scratchTextarea = document.createElement('textarea')
  scratchTextarea.innerHTML = encodedText
  return scratchTextarea.value
}
