import { useEffect, useState } from "react";

export function useCompanyManagers(companyList: string[]) {
  const [managers, setManagers] = useState<Record<string, { name: string; profileImage?: string }>>({});

  useEffect(() => {
    async function fetchManagers() {
      const res = await fetch("http://localhost:5000/api/users");
      if (!res.ok) return;
      const users = await res.json();
      const managerMap: Record<string, { name: string; profileImage?: string }> = {};
      for (const company of companyList) {
        const manager = users.find((u: any) => u.company === company && u.role && u.role.toLowerCase() === "manager");
        if (manager) {
          managerMap[company] = { name: manager.name, profileImage: manager.profileImage };
        }
      }
      setManagers(managerMap);
    }
    if (companyList.length) fetchManagers();
  }, [companyList]);

  return managers;
}
