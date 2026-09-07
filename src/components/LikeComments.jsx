"use client";

import { useState } from "react";
import { createPosts } from "@/actions/posts";
import { deleteCommentAction } from "@/actions/deleteComment";

export default function LikeComments({ post, currentUserId, comments = [] }) {
  const [activeReplyBoxId, setActiveReplyBoxId] = useState(null);

  // 🌲 Cleaned tree builder strictly referencing database parent_id snake_case field layout
  const buildTree = (nodes) => {
    const map = {};
    const roots = [];

    // Step 1: Index all comment rows cleanly inside a working map
    nodes.forEach((node) => {
      map[node.id] = { ...node, children: [] };
    });

    // Step 2: Structure tree hierarchies
    nodes.forEach((node) => {
      const pId = node.parent_id;

      if (pId && map[pId]) {
        // Valid parent comment node exists: append to children array
        map[pId].children.push(map[node.id]);
      } else {
        // Direct post comment or fallback: keep at root tier so it shows on screen
        roots.push(map[node.id]);
      }
    });
    return roots;
  };

  const commentTree = buildTree(comments);

  // 🔄 Recursive Node Rendering Engine
  const CommentNode = ({ node, depth = 0 }) => {
    const nodeCreatedAt = node.created_at || node.createdAt;

    return (
      <div
        className='relative mt-4 border-l border-slate-200 pl-4 transition-all dark:border-slate-800'
        style={{
          marginLeft: depth > 0 ? `${Math.min(depth * 0.5, 2)}rem` : "0rem",
        }}>
        {/* Connection node dot element indicator */}
        <div className='absolute left-[-4.5px] top-4 h-2 w-2 rounded-full bg-slate-800 dark:bg-slate-700' />

        <div className='rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-200 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:border-slate-700/50'>
          <div className='flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1'>
            <span className='text-emerald-400 font-bold'>
              @{node.author || "anonymous"}
            </span>
            <div className='flex items-center gap-3'>
              {nodeCreatedAt && (
                <span>
                  {new Date(nodeCreatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              )}

              {/* 🗑️ SECURE DELETE ACTION KEY */}
              {currentUserId &&
                currentUserId === (node.authorId || node.author_id) && (
                  <button
                    onClick={async () => {
                      if (
                        confirm("Confirm removal of this pulse node thread?")
                      ) {
                        await deleteCommentAction(
                          node.id,
                          post.id,
                          currentUserId,
                        );
                      }
                    }}
                    className='text-red-400/70 hover:text-red-400 transition-colors uppercase font-bold text-[10px]'>
                    [Delete]
                  </button>
                )}
            </div>
          </div>

          <p className='font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
            {node.content}
          </p>

          {/* 🛠️ REPLY INTERACTION TRIGGERS */}
          {currentUserId ? (
            <div className='mt-2'>
              <button
                onClick={() =>
                  setActiveReplyBoxId(
                    activeReplyBoxId === node.id ? null : node.id,
                  )
                }
                className='text-[10px] font-mono uppercase text-slate-500 hover:text-emerald-400 transition-colors'>
                {activeReplyBoxId === node.id
                  ? "// Close Array"
                  : "// Inject Reply Node"}
              </button>

              {/* Nested Input Field Box */}
              {activeReplyBoxId === node.id && (
                <form
                  action={async (formData) => {
                    await createPosts(null, formData);
                    setActiveReplyBoxId(null);
                  }}
                  className='mt-3 flex gap-2'>
                  {/* Changed name from parentId to parent_id to match your database layer schema */}
                  <input type='hidden' name='parent_id' value={node.id} />
                  <input
                    type='text'
                    name='content'
                    placeholder={`Reply directly to @${node.author}...`}
                    className='w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
                    required
                  />
                  <button
                    type='submit'
                    className='px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold uppercase rounded-lg transition-colors'>
                    Transmit
                  </button>
                </form>
              )}
            </div>
          ) : (
            <span className='text-[9px] font-mono text-slate-600 tracking-tight block mt-1'>
              // Authenticate to inject node interaction lines.
            </span>
          )}
        </div>

        {/* 🌲 Output sub-child arrays iteratively under their parents */}
        {node.children &&
          node.children.map((child) => (
            <CommentNode key={child.id} node={child} depth={depth + 1} />
          ))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* 📥 TOP LEVEL COMMENT INPUT INJECTION INTERFACE */}
      <div className='mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900/20'>
        <h3 className='mb-2 text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400'>
          Broadcast New Thread Node
        </h3>
        {currentUserId ? (
          <form
            action={async (formData) => {
              await createPosts(null, formData);
            }}
            className='flex flex-col gap-2'>
            {/* Top-tier comments pass post.id to group it to this timeline segment */}
            <input type='hidden' name='parent_id' value={post.id} />
            <textarea
              name='content'
              placeholder='Type out your response array payload here...'
              rows={3}
              className='w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
              required
            />
            <div className='flex justify-end'>
              <button
                type='submit'
                className='px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-mono font-bold uppercase rounded-xl transition-colors'>
                Transmit Pulse
              </button>
            </div>
          </form>
        ) : (
          <div className='rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-900 dark:bg-slate-950/40'>
            <p className='text-xs font-mono text-slate-500 italic'>
              // Core stream locked. Please sign in to write comments on this
              pipeline.
            </p>
          </div>
        )}
      </div>

      {/* SYSTEM THREADS LAYER */}
      <div className='mt-8 border-t border-slate-200 pt-6 dark:border-slate-800/60'>
        <h2 className='text-sm font-mono font-bold uppercase tracking-wider text-slate-400 mb-4'>
          System Threads Layer
        </h2>

        {commentTree.length === 0 ? (
          <p className='text-xs font-mono text-slate-600 italic'>
            // No nodes on this segment loop.
          </p>
        ) : (
          commentTree.map((rootComment) => (
            <CommentNode key={rootComment.id} node={rootComment} />
          ))
        )}
      </div>
    </div>
  );
}
