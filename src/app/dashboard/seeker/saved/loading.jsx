export default function SavedOpportunitiesLoading() {
  return (
    <div
      className='mx-auto max-w-4xl animate-pulse px-4 py-6'
      aria-label='Loading saved opportunities'>
      <div className='mb-6 h-6 w-56 rounded bg-slate-200 dark:bg-slate-800' />
      <div className='space-y-5'>
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className='space-y-3 border-b border-slate-200 pb-5 dark:border-slate-800'>
            <div className='h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-800' />
            <div className='h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800' />
          </div>
        ))}
      </div>
    </div>
  );
}
