export default function NotificationsLoading() {
  return (
    <div
      className='mx-auto max-w-3xl animate-pulse px-4 py-6'
      aria-label='Loading notifications'>
      <div className='mb-6 h-6 w-44 rounded bg-slate-200 dark:bg-slate-800' />
      <div className='space-y-4'>
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className='flex gap-3 border-b border-slate-200 pb-4 dark:border-slate-800'>
            <div className='mt-1 h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800' />
            <div className='flex-1 space-y-2'>
              <div className='h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800' />
              <div className='h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
