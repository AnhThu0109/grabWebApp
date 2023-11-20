function formatPeopleId(id, prefix) {
  const paddedId = String(id).padStart(4, "0");
  return `${prefix}${paddedId}`;
}

export default formatPeopleId;
