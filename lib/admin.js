// lib/admin.js
"use client";

import { useUser } from "@clerk/nextjs";

export function useAdminCheck() {
  const { user, isLoaded } = useUser();
  
  const checkAdminStatus = async () => {
    if (!user) return false;
    
    try {
      const response = await fetch('/api/admin/check-status');
      if (response.ok) {
        const data = await response.json();
        return data.isAdmin;
      }
      return false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  return { checkAdminStatus, user, isLoaded };
}

// Server-side admin check for API routes or server components
export async function getServerSideAdminStatus(request) {
  const { getAuth } = await import('@clerk/nextjs/server');
  const { userId } = getAuth(request);
  const ADMIN_USERS = process.env.ADMIN_USERS ? process.env.ADMIN_USERS.split(',') : [];
  
  return {
    isAdmin: userId ? ADMIN_USERS.includes(userId) : false,
    userId
  };
}