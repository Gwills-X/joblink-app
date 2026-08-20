export default function ChatRequestList({ requests, currentUserId }) {
  if (!requests || requests.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500'>
        No requests found.
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {requests.map((request) => (
        <div
          key={request.id}
          className='rounded-xl border border-slate-700 bg-slate-950 p-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <div className='text-[10px] uppercase tracking-[0.2em] text-slate-500'>
                {request.sender_id === currentUserId
                  ? "Sent to"
                  : "Received from"}
              </div>
              <div className='mt-1 text-sm font-medium text-slate-200'>
                {request.sender_id === currentUserId
                  ? request.receiver_name
                  : request.sender_name}
              </div>
            </div>
            <span className='rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300'>
              {request.status}
            </span>
          </div>
          <p className='mt-3 text-sm text-slate-300'>"{request.message}"</p>
        </div>
      ))}
    </div>
  );
}
