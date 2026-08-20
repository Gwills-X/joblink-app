import getAuthUser from "@/lib/getAuthUser";
import { chatEngine } from "@/services/chatEngine";
import MessageBubble from "@/components/MessageBubble";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sendMessageAction } from "@/actions/chatActions";

export const dynamic = "force-dynamic";

export default async function ChatRoomPage({ params }) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { roomId } = await params;
  const userId = String(user.userId || user.id);

  let messages = [];
  let room = null;

  try {
    messages = await chatEngine.getMessages(roomId, userId);
    const rooms = await chatEngine.getUserRooms(userId);
    room = rooms.find((item) => String(item.id) === String(roomId)) || null;
  } catch (error) {
    return (
      <div className='p-6'>
        <div className='rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300'>
          {error.message || "This conversation is not available."}
        </div>
      </div>
    );
  }

  const otherUser = room
    ? room.participant_one === userId
      ? { name: room.participant_two_name, id: room.participant_two }
      : { name: room.participant_one_name, id: room.participant_one }
    : null;

  return (
    <div className='flex min-h-[85vh] flex-col gap-5 p-4 md:p-8'>
      <div className='sticky top-0 z-10 -mx-4 -mt-4 rounded-b-2xl border-b border-slate-700 bg-[var(--color-surface)]/95 px-4 py-4 backdrop-blur-md md:-mx-8 md:-mt-8 md:px-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link
              href='/dashboard/chats'
              className='inline-flex rounded-lg border border-slate-700/50 p-2 text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
            <div>
              <div className='text-[10px] uppercase tracking-[0.3em] text-slate-500'>
                Message Thread
              </div>
              <h1 className='text-lg font-semibold text-slate-100'>
                {otherUser ? otherUser.name : "Conversation"}
              </h1>
            </div>
          </div>
          <div className='rounded-full border border-slate-700/40 bg-slate-900/30 px-3 py-1.5 text-[10px] text-slate-400'>
            {messages.length} message{messages.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className='flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-700 bg-[var(--color-surface)] p-5'>
        {messages.length === 0 ? (
          <div className='flex h-full items-center justify-center'>
            <div className='rounded-xl border border-dashed border-slate-700/40 p-8 text-center text-sm text-slate-500'>
              <div className='mx-auto mb-3 h-10 w-10 rounded-full bg-slate-800/40' />
              <p>No messages yet</p>
              <p className='mt-1 text-xs'>
                Send the first message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={userId}
            />
          ))
        )}
      </div>

      <form
        action={sendMessageAction}
        className='sticky bottom-0 z-10 -mx-4 -mb-4 rounded-t-2xl border-t border-slate-700 bg-[var(--color-surface)] px-4 py-4 backdrop-blur-md md:-mx-8 md:-mb-8 md:px-8'>
        <input type='hidden' name='room_id' value={roomId} />
        <div className='flex gap-3'>
          <textarea
            name='content'
            rows={2}
            required
            placeholder='Type a message...'
            className='flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50'
          />
          <button
            type='submit'
            className='inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95'>
            <SendHorizonal className='h-4 w-4' />
            <span className='hidden sm:inline'>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
