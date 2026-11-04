function formatRange(min, max) {
  if (min == null) return "N/A";
  if (max == null) return `${min}+`;

  return min === max ? `${min}` : `${min} - ${max}`;
}

module.exports = { formatRange };