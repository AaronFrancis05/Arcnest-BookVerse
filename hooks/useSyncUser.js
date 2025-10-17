// hooks/useSyncUser.js
"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function useSyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user to database on client side
      fetch("/api/users/sync", {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Failed to sync user");
          }
        })
        .catch((error) => {
          console.error("Error syncing user:", error);
        });
    }
  }, [user, isLoaded]);
}
