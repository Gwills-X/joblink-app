"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFollowAction } from "@/actions/socialActions";

export default function FollowButton({
  currentUserId,
  targetId,
  isInitiallyFollowing,
}) {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    // 1. Optimistic UI update: Toggle state immediately for a snappy feel
    setIsFollowing(!isFollowing);

    // 2. Wrap server action in a transition to handle the async update
    startTransition(async () => {
      try {
        const res = await toggleFollowAction(currentUserId, targetId);

        // 3. Refresh the Server Component data (stats) without a full page reload
        router.refresh();

        // Dispatch a toast notification
        if (typeof window !== "undefined") {
          const msg =
            res?.message || (res?.following ? "Now following" : "Unfollowed");
          window.dispatchEvent(
            new CustomEvent("toast", {
              detail: { type: "success", message: msg },
            }),
          );
        }
      } catch (error) {
        // 4. Revert UI state if the server request fails
        setIsFollowing(isFollowing);
        console.error("Failed to update follow status:", error);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("toast", {
              detail: {
                type: "error",
                message: "Failed to update follow status",
              },
            }),
          );
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
        isFollowing
          ? "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
          : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
      }`}>
      {isPending ? "Updating..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
