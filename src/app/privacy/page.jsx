import BackLink from "@/components/BackLink";

export default function PrivacyPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6'>
      <BackLink />
      <h1 className='mb-6 text-4xl font-bold text-slate-900 dark:text-white'>
        Privacy Policy
      </h1>
      <div className='space-y-4 text-sm text-slate-700 dark:text-slate-400'>
        <p>
          We respect your privacy. At VibeCred, we only collect the information
          necessary to provide you with a functional professional profile.
        </p>
        <p>
          We do not sell your data to third parties. Your data is used
          exclusively to facilitate connection and content sharing within the
          collective.
        </p>
      </div>
    </main>
  );
}
