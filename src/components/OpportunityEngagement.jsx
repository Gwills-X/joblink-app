"use client";

import { useState } from "react";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

export default function OpportunityEngagement({ commentCount = 0 }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className='flex flex-wrap items-center gap-2 border-t border-slate-200 pt-5 dark:border-slate-800'>
      <button
        type='button'
        aria-pressed={liked}
        onClick={() => setLiked((value) => !value)}
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all active:scale-[0.98] ${
          liked
            ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-rose-300 hover:text-rose-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:text-rose-300"
        }`}>
        <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        {liked ? "Liked" : "Like"}
      </button>
      <button
        type='button'
        aria-pressed={bookmarked}
        onClick={() => setBookmarked((value) => !value)}
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all active:scale-[0.98] ${
          bookmarked
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-emerald-500/30 dark:hover:text-emerald-300"
        }`}>
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
        {bookmarked ? "Saved" : "Bookmark"}
      </button>
      <a
        href='#discussion'
        className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-emerald-500/30 dark:hover:text-emerald-300'>
        <MessageCircle className='h-4 w-4' />
        {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
      </a>
    </div>
  );
}
