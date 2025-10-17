// components/UserSync.js
"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && user) {
            fetch("/api/users/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                }),
            }).catch((error) => {
                console.error("Error syncing user:", error);
            });
        }
    }, [user, isLoaded]);

    return null; // This component doesn't render anything
}