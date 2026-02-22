// API utility to get users by company name
import api from '@/api/client';

export async function fetchUsersByCompany(company: string) {
  const { data: users } = await api.get('/users');
  // Only return users with matching company name
  return users.filter((u: any) => u.company && u.company.toLowerCase() === company.toLowerCase());
}
