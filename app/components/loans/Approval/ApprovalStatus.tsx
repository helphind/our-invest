export const getStatus = (member) => {
  const approved = member.approvals?.[0]?.approved;

  if (approved === true) return "APPROVED";
  if (approved === false) return "REJECTED";
  return "PENDING";
};
