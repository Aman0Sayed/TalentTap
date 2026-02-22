// Fetch unique company names from backend
import api from '@/api/client';

export async function fetchCompanyList() {
  const { data: users } = await api.get('/users');
  const companies = Array.from(new Set(users.map((u: any) => u.company).filter(Boolean)));
  return companies;
}
