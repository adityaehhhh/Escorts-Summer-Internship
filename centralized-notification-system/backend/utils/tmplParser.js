function render(template, data = {}) {
  return String(template).replace(/\{(\w+)\}/g, (match, p1) => {
    return (p1 in data) ? String(data[p1]) : match;
  });
}

module.exports = { render };
