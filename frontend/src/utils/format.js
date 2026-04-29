//date formattting
export const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value); //js date object
  if (Number.isNaN(d.getTime())) return "-";
  d.toLocaleDateString();
};
export const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value); //js date object
  if (Number.isNaN(d.getTime())) return "-";
  d.toLocaleString();
};