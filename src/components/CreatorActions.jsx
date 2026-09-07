"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import FollowButton from "@/components/FollowButton";
import ChatRequestButton from "@/components/ChatRequestButton";

export default function CreatorActions({
  creatorId,
  creatorName = "Creator",
  currentUserId,
  isInitiallyFollowing = false,
  chatRelationship,
}) {
  if (!creatorId) return null;

  const isSelf = String(creatorId) === String(currentUserId);

  return (
    <div className='flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 dark:border-slate-800'>
      <Link
        href={`/dashboard/network/${creatorId}`}
        className='inline-flex min-w-0 items-center gap-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400'>
        <UserCircle className='h-4 w-4 shrink-0' />
        <span className='max-w-40 truncate'>{creatorName}</span>
      </Link>
      {currentUserId && !isSelf && (
        <>
          <FollowButton
            currentUserId={currentUserId}
            targetId={creatorId}
            isInitiallyFollowing={isInitiallyFollowing}
          />
          <ChatRequestButton
            receiverId={creatorId}
            receiverName={creatorName}
            relationshipStatus={chatRelationship?.status}
            roomId={chatRelationship?.roomId}
            requestId={chatRelationship?.requestId}
          />
        </>
      )}
    </div>
  );
}
