import BackLink from "@/components/BackLink";

export default function GuidelinesPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6'>
      <BackLink />
      <h1 className='mb-6 text-4xl font-bold text-slate-900 dark:text-white'>
        Community Guidelines
      </h1>
      <div className='space-y-4 text-slate-700 dark:text-slate-400'>
        <ul className='list-disc pl-5 space-y-2'>
          <li>
            <strong>Respect Diversity:</strong> Everyone comes from different
            backgrounds. Keep discourse professional.
          </li>
          <li>
            <strong>Be Constructive:</strong> Critique ideas, not people.
          </li>
          <li>
            <strong>Stay Relevant:</strong> Keep posts focused on professional
            insights, research, or creative work.
          </li>
          <li>
            <strong>Zero Tolerance:</strong> Harassment or discriminatory
            behavior will result in a permanent account restriction.
          </li>
        </ul>
      </div>
    </main>
  );
}
