import getAuthUser from "@/lib/getAuthUser";
import { chatEngine } from "@/services/chatEngine";
import ChatRoomCard from "@/components/ChatRoomCard";
import AcceptChatRequestButton from "@/components/AcceptChatRequestButton";
import { MessageSquareText, BellRing, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ChatsPage() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <div className='p-6 text-slate-300'>
        Please log in to view your chats.
      </div>
    );
  }

  const userId = String(user.userId || user.id);
  const rooms = await chatEngine.getUserRooms(userId);
  const requests = await chatEngine.getUserChatRequests(userId);

  const incomingRequests = requests.filter(
    (request) => request.receiver_id === userId && request.status === "PENDING",
  );

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='space-y-1'>
        <div className='inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300'>
          <Sparkles className='h-3.5 w-3.5' />
          Communication Hub
        </div>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50'>
          Chat & Conversations
        </h1>
        <p className='text-sm leading-relaxed text-slate-400'>
          Stay connected. Request conversations, manage incoming messages, and
          build meaningful relationships.
        </p>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-linear-to-r dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-950/40'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BellRing className='h-4 w-4 text-amber-400' />
            <span className='text-sm font-medium text-slate-200'>
              {incomingRequests.length} pending
            </span>
          </div>
          <span className='text-xs text-slate-500'>
            request{incomingRequests.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-[1.1fr,1.4fr]'>
        <div className='grid gap-6 lg:grid-cols-[1.1fr,1.4fr]'>
          <section className='rounded-2xl border border-slate-700 bg-(--color-surface) p-5 backdrop-blur'>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-semibold text-slate-100'>
                  Incoming Requests
                </h2>
                <p className='mt-1 text-xs text-slate-500'>
                  People wanting to connect
                </p>
              </div>
              <div className='rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-mono font-semibold text-slate-700 dark:border-slate-700/50 dark:bg-slate-950/60 dark:text-slate-300'>
                {incomingRequests.length}
              </div>
            </div>

            <div className='space-y-3'>
              {incomingRequests.length === 0 ? (
                <div className='rounded-xl border border-dashed border-slate-700/40 p-6 text-center text-sm text-slate-500'>
                  <div className='mx-auto mb-2 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800/40' />
                  No pending requests
                </div>
              ) : (
                incomingRequests.map((request) => (
                  <div
                    key={request.id}
                    className='group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-emerald-500/30 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:bg-slate-900/80'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <div className='text-[10px] uppercase tracking-[0.2em] text-slate-600'>
                          From
                        </div>
                        <h3 className='mt-1.5 text-sm font-semibold text-slate-100'>
                          {request.sender_name}
                        </h3>
                      </div>
                      <span className='rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-amber-300'>
                        New
                      </span>
                    </div>

                    <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                      "{request.message}"
                    </p>

                    <div className='mt-4 pt-3 border-t border-slate-700/50'>
                      <AcceptChatRequestButton requestId={request.id} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className='rounded-2xl border border-slate-700 bg-(--color-surface) p-5 backdrop-blur'>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-semibold text-slate-100'>
                  Active Conversations
                </h2>
                <p className='mt-1 text-xs text-slate-500'>
                  Your message threads
                </p>
              </div>
              <div className='rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-mono font-semibold text-slate-700 dark:border-slate-700/50 dark:bg-slate-950/60 dark:text-slate-300'>
                {rooms.length}
              </div>
            </div>

            <div className='space-y-3'>
              {rooms.length === 0 ? (
                <div className='rounded-xl border border-dashed border-slate-700/40 p-6 text-center text-sm text-slate-500'>
                  <div className='mx-auto mb-2 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800/40' />
                  Start a new conversation
                </div>
              ) : (
                rooms.map((room) => (
                  <ChatRoomCard
                    key={room.id}
                    room={room}
                    currentUserId={userId}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        <section className='rounded-2xl border border-slate-700 bg-(--color-surface) p-5 backdrop-blur'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='rounded-lg bg-emerald-500/15 p-2.5 text-emerald-400'>
              <MessageSquareText className='h-5 w-5' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-slate-100'>
                Request History
              </h2>
              <p className='mt-0.5 text-xs text-slate-500'>
                All sent and received connection requests
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            {requests.length === 0 ? (
              <div className='rounded-xl border border-dashed border-slate-700/40 p-6 text-center text-sm text-slate-500'>
                <div className='mx-auto mb-2 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800/40' />
                No request history
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className='flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition-all hover:bg-slate-100 dark:border-slate-700/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/60'>
                  <div>
                    <div className='text-[10px] uppercase tracking-[0.2em] text-slate-600'>
                      {request.sender_id === userId
                        ? "Sent to"
                        : "Received from"}
                    </div>
                    <div className='mt-1 text-sm font-medium text-slate-200'>
                      {request.sender_id === userId
                        ? request.receiver_name
                        : request.sender_name}
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      request.status === "ACCEPTED"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : request.status === "PENDING"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700/50 dark:bg-slate-800/30 dark:text-slate-400"
                    }`}>
                    {request.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
