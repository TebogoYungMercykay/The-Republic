'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import { useOrganizations } from '@/lib/contexts/OrganizationProvider';
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard';
import { useUser } from '../../../../../lib/contexts/UserContext';

export default function AdminOrganizationPage() {
  const params = useParams();
  const router = useRouter(); // Get router instance
  const { user } = useUser(); 
  const { organizations } = useOrganizations();
  const id = Number(params.id);

  const organization = organizations.find(org => org.id === id);

  if (!organization || !organization.isAdmin) {
    return <div className="p-5">You do not have permission to access this page.</div>;
  }



  return (
    <div>
      <AdminDashboard organization={organization} />
    </div>
  );
}
