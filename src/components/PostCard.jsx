"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DeleteModal from "./DeleteModal";
import { useState, useEffect, useTransition, useOptimistic } from "react";
import { handleToggleLike } from "@/actions/posts";

export default function PostCard({ post, currentUserId }) {
  const path = usePathname();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticLikeState, setOptimisticLikeState] = useOptimistic(
    { liked: post.hasLiked || false, count: post.likesCount || 0 },
    (state, nextLikedState) => ({
      liked: nextLikedState,
      count: nextLikedState ? state.count + 1 : Math.max(0, state.count - 1),
    }),
  );

  // --- MEDIA RENDERING LOGIC ---
  const renderMedia = (post) => {
    if (post.fileType === "none" || !post.mediaUrl) return null;

    // Video Thumbnail (in your PostCard.jsx)
    if (post.fileType === "video") {
      return (
        <div
          onClick={() => setIsFullScreen(true)}
          className='relative w-full max-w-60 aspect-video cursor-pointer group rounded-xl overflow-hidden border border-slate-700 bg-black shadow-lg hover:ring-2 hover:ring-emerald-500/50 transition-all'>
          {/* Video preview with muted/no-controls for the thumbnail */}
          <video src={post.mediaUrl} className='w-full h-full object-cover' />

          {/* Cinematic Play Overlay */}
          <div className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all'>
            <div className='w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500/90 backdrop-blur-sm shadow-xl'>
              <svg
                className='w-6 h-6 text-slate-950 fill-current ml-1'
                viewBox='0 0 24 24'>
                <path d='M8 5v14l11-7z' />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // Document/Raw Download
    if (post.fileType === "raw") {
      return (
        <a
          href={post.mediaUrl}
          target='_blank'
          download
          className='flex items-center gap-2 p-2 w-fit bg-slate-800 border border-slate-700 text-emerald-400 rounded hover:bg-slate-700 transition-all text-xs font-mono uppercase'>
          📄 Download {post.format?.toUpperCase() || "File"}
        </a>
      );
    }

    // Image Thumbnail
    return (
      <div
        // onClick={() => setIsFullScreen(true)}
        className='w-30 h-auto overflow-hidden rounded-lg border border-slate-700 cursor-pointer hover:opacity-80 transition-opacity'>
        <img src={post.mediaUrl} alt='Thumbnail' className='w-full h-full ' />
      </div>
    );
  };

  useEffect(() => {
    setMounted(true);
    if (post.createdAt) {
      const createdDate = new Date(post.createdAt);
      const thirtyMinutesInMs = 30 * 60 * 1000;
      const timeDifference = new Date().getTime() - createdDate.getTime();
      setIsEditable(timeDifference >= 0 && timeDifference < thirtyMinutesInMs);
    }
  }, [post.createdAt]);

  const cardDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleLikeClick = async () => {
    if (!currentUserId) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: { type: "error", message: "Please log in to react." },
          }),
        );
      }
      return;
    }
    const targetLikedState = !optimisticLikeState.liked;
    startTransition(async () => {
      setOptimisticLikeState(targetLikedState);
      const res = await handleToggleLike(post.id);
      if (!res?.success) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("toast", {
              detail: { type: "error", message: "Transaction failed to sync." },
            }),
          );
        }
      } else {
        if (typeof window !== "undefined") {
          const msg = res.liked ? "Liked" : "Unliked";
          window.dispatchEvent(
            new CustomEvent("toast", {
              detail: { type: "success", message: msg },
            }),
          );
        }
      }
    });
  };

  return (
    <article className='card-primary flex flex-col justify-between rounded-3xl p-5 shadow-2xl transition-transform duration-200 hover:-translate-y-1 group selection:bg-emerald-500/10 selection:text-emerald-400'>
      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-4 text-xs font-mono text-slate-400'>
          <div className='space-y-1'>
            <span className='block text-slate-400'>
              By @{post.authorName || "anonymous"}
            </span>
            {cardDate && <span className='text-slate-500'>{cardDate}</span>}
          </div>
          <span className='status-pill bg-slate-950/80 text-emerald-300 border border-emerald-500/15'>
            {post.category || "Update"}
          </span>
        </div>

        <h3 className='text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-2'>
          {post.title}
        </h3>

        {renderMedia(post)}

        <p className='text-sm text-slate-300 leading-relaxed line-clamp-3'>
          {post.content}
        </p>
      </div>

      <div className='mt-5 pt-5 border-t border-slate-800/70 space-y-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <button
            onClick={handleLikeClick}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all ${optimisticLikeState.liked ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-slate-950/70 text-slate-300 border border-slate-800/70 hover:bg-slate-900"}`}>
            <svg
              className={`w-4 h-4 ${optimisticLikeState.liked ? "fill-emerald-400" : "fill-none stroke-current"}`}
              viewBox='0 0 24 24'
              strokeWidth='2'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            <span>{optimisticLikeState.count}</span>
          </button>

          <Link
            href={`/posts/show/${post.id}`}
            className='inline-flex items-center gap-2 rounded-full bg-slate-950/80 border border-slate-800/70 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-all'>
            <span>{post.commentsCount || 0} comments</span>
          </Link>
        </div>

        <div className='flex items-center justify-between gap-4'>
          <Link
            href={`/posts/show/${post.id}`}
            className='text-xs font-semibold uppercase tracking-widest text-emerald-300 hover:text-emerald-200 transition-colors'>
            View details →
          </Link>
          {path === "/dashboard" && mounted && (
            <div className='flex items-center gap-3'>
              {isEditable ? (
                <Link
                  href={`/posts/edit/${post.id}`}
                  className='text-xs font-semibold uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors'>
                  Edit
                </Link>
              ) : (
                <span className='text-xs text-slate-500 italic uppercase tracking-widest'>
                  Locked
                </span>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                className='text-xs font-semibold uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors'>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isFullScreen && (
        <div
          className='fixed inset-0 z-100 flex items-center justify-center bg-black/98 backdrop-blur-xl p-0'
          onClick={() => setIsFullScreen(false)}>
          {/* Close button - Top Right */}
          <button
            onClick={() => setIsFullScreen(false)}
            className='absolute top-6 right-6 z-101 text-white/70 hover:text-white p-2 bg-white/10 rounded-full'>
            ✕
          </button>

          {/* Video Container: Fits screen perfectly */}
          <div
            className='relative w-full h-full flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}>
            <video
              src={post.mediaUrl}
              controls
              autoPlay
              playsInline // CRITICAL for iOS/Android to play without forcing full screen
              className='max-h-full w-full object-contain'
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <DeleteModal
        postId={post.id}
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        publicId={post.publicId} // Pass this from the database record
        fileType={post.fileType} // Pass this from the database record
      />
    </article>
  );
}
