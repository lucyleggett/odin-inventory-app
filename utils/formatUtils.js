function formatRange(min, max) {
  if (min == null) return "N/A";
  if (max == null) return `${min}+`;

  return min === max ? `${min}` : `${min} - ${max}`;
}

function toSentenceCase(string) {
  if (!string) return "";
  if (typeof string !== "string") return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toTitleCase(string) {
  if (!string) return string;
  if (typeof string !== "string") return string;

  return string
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

module.exports = {
  formatRange,
  toSentenceCase,
  toTitleCase,
};
