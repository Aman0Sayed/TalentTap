// API helpers for manager actions
export async function fetchPendingJoinRequests(company: string) {
  const res = await fetch(`http://localhost:5000/api/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const users = await res.json();
  return users.filter((u: any) => u.company === company && u.companyStatus === 'waiting');
}

export async function approveJoinRequest(userId: string) {
  const res = await fetch('http://localhost:5000/api/company/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, approve: true })
  });
  if (!res.ok) throw new Error('Failed to approve user');
  return res.json();
}

export async function rejectJoinRequest(userId: string) {
  const res = await fetch('http://localhost:5000/api/company/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, approve: false })
  });
  if (!res.ok) throw new Error('Failed to reject user');
  return res.json();
}

export async function removeTeamMember(userId: string) {
  const res = await fetch('http://localhost:5000/api/company/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to remove user');
  return res.json();
}
