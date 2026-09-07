"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createOpportunityComment,
  deleteOpportunityComment,
} from "@/actions/opportunityComments";

function buildCommentTree(comments) {
  const commentMap = new Map();
  const roots = [];

  comments.forEach((comment) => {
    commentMap.set(String(comment.id), { ...comment, children: [] });
  });

  comments.forEach((comment) => {
    const node = commentMap.get(String(comment.id));
    const parent = comment.parent_id
      ? commentMap.get(String(comment.parent_id))
      : null;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function OpportunityComments({
  id,
  opportunityId,
  comments = [],
  currentUserId,
}) {
  const router = useRouter();
  const [activeReplyId, setActiveReplyId] = useState(null);
  const commentTree = buildCommentTree(comments);

  const CommentNode = ({ node, depth = 0 }) => (
    <div
      className='relative border-l border-slate-200 pl-4 dark:border-slate-800'
      style={{
        marginLeft: depth > 0 ? `${Math.min(depth * 0.5, 2)}rem` : "0rem",
      }}>
      <div className='absolute left-[-4.5px] top-5 h-2 w-2 rounded-full bg-slate-700' />
      <div className='rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-200 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700'>
        <div className='flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500'>
          <span className='font-semibold text-emerald-400'>
            @{node.author_name || "member"}
          </span>
          <div className='flex items-center gap-3 font-mono'>
            {node.created_at && (
              <span>{new Date(node.created_at).toLocaleDateString()}</span>
            )}
            {currentUserId &&
              String(node.user_id) === String(currentUserId) && (
                <button
                  type='button'
                  onClick={async () => {
                    const result = await deleteOpportunityComment(
                      node.id,
                      opportunityId,
                    );
                    if (result?.success) router.refresh();
                  }}
                  className='text-rose-400/80 transition-colors hover:text-rose-300'>
                  Delete
                </button>
              )}
          </div>
        </div>

        <p className='mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300'>
          {node.content}
        </p>

        {currentUserId && (
          <div className='mt-3'>
            <button
              type='button'
              onClick={() =>
                setActiveReplyId(activeReplyId === node.id ? null : node.id)
              }
              className='text-[10px] font-mono uppercase tracking-wider text-slate-500 transition-colors hover:text-emerald-400'>
              {activeReplyId === node.id ? "Close reply" : "Reply"}
            </button>

            {activeReplyId === node.id && (
              <form
                action={async (formData) => {
                  await createOpportunityComment(formData);
                  setActiveReplyId(null);
                }}
                className='mt-3 flex flex-col gap-2 sm:flex-row'>
                <input
                  type='hidden'
                  name='opportunity_id'
                  value={opportunityId}
                />
                <input type='hidden' name='parent_id' value={node.id} />
                <input
                  name='content'
                  required
                  placeholder={`Reply to @${node.author_name || "member"}`}
                  className='min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500'
                />
                <button
                  type='submit'
                  className='rounded-lg bg-emerald-500 px-3 py-2 text-[10px] font-bold uppercase text-slate-950 transition-colors hover:bg-emerald-400'>
                  Reply
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {node.children.map((child) => (
        <div key={child.id} className='mt-3'>
          <CommentNode node={child} depth={depth + 1} />
        </div>
      ))}
    </div>
  );

  return (
    <section
      id={id}
      className='scroll-mt-24 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-md md:p-8 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:shadow-none'>
      <div>
        <span className='font-mono text-[10px] uppercase tracking-widest text-emerald-400'>
          Discussion
        </span>
        <h2 className='mt-1 text-xl font-semibold text-slate-900 dark:text-white'>
          Questions about this opportunity
        </h2>
        <p className='mt-1 text-sm text-slate-500'>
          Ask for context, share relevant information, and continue the
          conversation.
        </p>
      </div>

      {currentUserId ? (
        <form
          action={createOpportunityComment}
          className='space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50'>
          <input type='hidden' name='opportunity_id' value={opportunityId} />
          <textarea
            name='content'
            required
            rows={3}
            placeholder='Ask a question or add useful context...'
            className='w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500'
          />
          <div className='flex justify-end'>
            <button
              type='submit'
              className='rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400'>
              Add Comment
            </button>
          </div>
        </form>
      ) : (
        <p className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-500'>
          Sign in to ask a question or reply to the discussion.
        </p>
      )}

      <div className='space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800'>
        {commentTree.length > 0 ? (
          commentTree.map((comment) => (
            <CommentNode key={comment.id} node={comment} />
          ))
        ) : (
          <p className='text-sm text-slate-500'>
            No questions yet. Start the discussion.
          </p>
        )}
      </div>
    </section>
  );
}
