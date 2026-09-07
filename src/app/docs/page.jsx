import React from "react";
import Link from "next/link";

export default function DocsPage() {
  const resourceSections = [
    { id: "intro", label: "01 // Welcome to JobLink" },
    { id: "opportunities", label: "02 // Find Your Next Step" },
    { id: "community", label: "03 // Build Your Network" },
    { id: "collaboration", label: "04 // Work Together" },
    { id: "engagement", label: "05 // Participate" },
  ];

  return (
    <div className='mx-auto min-h-screen max-w-7xl bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100'>
      {/* HEADER SECTION */}
      <div className='relative mb-12 space-y-2 border-b border-slate-200 pb-8 dark:border-slate-900'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none'></div>
        <span className='text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase'>
          JOBLINK RESOURCE CENTER
        </span>
        <h1 className='text-3xl font-black tracking-tighter text-slate-900 md:text-5xl dark:text-slate-100'>
          Find your next opportunity and connection
        </h1>
        <p className='max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
          Practical guidance for making the most of JobLink, whether you are
          looking for work, growing an organization, sharing an opportunity, or
          meeting people with complementary goals.
        </p>
      </div>

      {/* CORE TWO-COLUMN DOCUMENTATION LAYOUT */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-12 items-start'>
        {/* LEFT COLUMN: STICKY SIDEBAR INDEX */}
        <aside className='hidden lg:block lg:sticky lg:top-24 space-y-4'>
          <h3 className='text-xs font-mono font-bold uppercase tracking-wider text-slate-500 pl-2'>
            Explore JobLink
          </h3>
          <nav className='flex flex-col gap-1 border-l border-slate-200 dark:border-slate-900'>
            {resourceSections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className='-ml-px block border-l border-transparent py-2.5 pl-4 text-xs font-mono font-bold tracking-tight text-slate-600 transition-all hover:border-slate-300 hover:text-emerald-600 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-emerald-400'>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* RIGHT COLUMN: HIGH-DENSITY DOCUMENTATION BODY */}
        <div className='max-w-3xl space-y-16 font-sans text-sm leading-relaxed text-slate-700 lg:col-span-3 dark:text-slate-300'>
          {/* SECTION 1: INTRODUCTION */}
          <section id='intro' className='scroll-mt-24 space-y-4'>
            <h2 className='flex items-center gap-2 font-mono text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100'>
              <span className='text-emerald-400'>01 /</span> Introduction
            </h2>
            <p>
              JobLink brings opportunities and people into one welcoming
              professional space. You can discover roles, projects,
              partnerships, and conversations that match where you are now and
              where you want to go next.
            </p>
            <p>
              A strong profile helps others understand what you do, what you
              value, and the kind of opportunity you are open to. Share your
              experience honestly, keep your information current, and let your
              work speak for itself.
            </p>
          </section>

          <hr className='border-slate-200 dark:border-slate-900' />

          {/* SECTION 2: OPPORTUNITIES */}
          <section id='opportunities' className='scroll-mt-24 space-y-6'>
            <h2 className='flex items-center gap-2 font-mono text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100'>
              <span className='text-emerald-400'>02 /</span> Find Your Next Step
            </h2>
            <p>
              JobLink supports more than one kind of professional progress. Use
              the marketplace to compare options and choose the path that fits
              your goals.
            </p>

            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4'>
              <div className='space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-900 dark:bg-slate-900/40'>
                <h4 className='font-mono text-xs font-black text-emerald-400 uppercase tracking-wider'>
                  Opportunities
                </h4>
                <p className='text-xs leading-normal text-slate-600 dark:text-slate-400'>
                  Browse jobs, projects, collaborations, and partnerships shared
                  by people and organizations.
                </p>
              </div>

              <div className='space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-900 dark:bg-slate-900/40'>
                <h4 className='font-mono text-xs font-black text-emerald-400 uppercase tracking-wider'>
                  Professional Profiles
                </h4>
                <p className='text-xs text-slate-400 leading-normal'>
                  Learn about someone’s experience, interests, location, and
                  public work before starting a conversation.
                </p>
              </div>

              <div className='p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-2'>
                <h4 className='font-mono text-xs font-black text-amber-500 uppercase tracking-wider'>
                  Clear Expectations
                </h4>
                <p className='text-xs text-slate-400 leading-normal'>
                  Review the details, requirements, timing, and format of an
                  opportunity before you apply or reach out.
                </p>
              </div>

              <div className='p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-2'>
                <h4 className='font-mono text-xs font-black text-rose-500 uppercase tracking-wider'>
                  Your Pace
                </h4>
                <p className='text-xs text-slate-400 leading-normal'>
                  Whether you are exploring, applying, hiring, or collaborating,
                  JobLink lets you move forward at a pace that feels right.
                </p>
              </div>
            </div>
          </section>

          <hr className='border-slate-900' />

          {/* SECTION 3: COMMUNITY */}
          <section id='community' className='scroll-mt-24 space-y-4'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>03 /</span> Build Your Network
            </h2>
            <p>
              Good professional relationships begin with context and respect.
              Follow people whose work interests you, visit their public
              profiles, and send a chat request when you have a genuine reason
              to connect.
            </p>

            <blockquote className='p-4 rounded-xl bg-slate-900/30 border-l-2 border-amber-500 text-slate-400 text-xs font-mono space-y-1'>
              <p className='font-bold text-slate-300'>
                A thoughtful introduction goes further:
              </p>
              <p>Explain who you are and why you would like to connect.</p>
              <p>Keep conversations professional, clear, and considerate.</p>
            </blockquote>

            <p className='pt-2'>
              A chat request is only opened when the recipient accepts it. This
              keeps conversations intentional and gives both people control over
              who can contact them.
            </p>
          </section>

          <hr className='border-slate-900' />

          {/* SECTION 4: COLLABORATION */}
          <section id='collaboration' className='scroll-mt-24 space-y-4'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>04 /</span> Work Together
            </h2>
            <p>
              JobLink is designed for many kinds of work. Employers can share
              roles, independent professionals can offer their services, and
              teams can find collaborators for projects or partnerships.
            </p>

            <div className='overflow-x-auto pt-2'>
              <table className='w-full text-left font-mono text-xs border border-slate-900 rounded-xl overflow-hidden'>
                <thead>
                  <tr className='bg-slate-900 border-b border-slate-800 text-slate-400 [&_th]:p-3'>
                    <th>What you can do</th>
                    <th>Who it helps</th>
                    <th>What to share</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-900 [&_td]:p-3 text-slate-300'>
                  <tr>
                    <td className='text-emerald-400 font-bold'>
                      Find opportunities
                    </td>
                    <td>Job seekers and professionals</td>
                    <td>Your experience and goals</td>
                  </tr>
                  <tr>
                    <td className='text-emerald-400 font-bold'>Build a team</td>
                    <td>Employers and organizations</td>
                    <td>The role, project, or need</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className='pt-2'>
              The best opportunities are specific about the work, expectations,
              and next steps. The best profiles are open about strengths,
              interests, and the kind of support or collaboration they welcome.
            </p>
          </section>

          <hr className='border-slate-900' />

          {/* SECTION 5: PARTICIPATION */}
          <section id='engagement' className='scroll-mt-24 space-y-4'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>05 /</span> Participate
            </h2>
            <p>
              A healthy JobLink community is built through small, useful
              interactions:
            </p>
            <ul className='list-disc list-inside pl-2 space-y-2 text-slate-400 text-xs sm:text-sm'>
              <li>
                <strong className='text-slate-200 font-mono'>
                  Show appreciation:
                </strong>{" "}
                Follow people whose work you want to keep up with and respond to
                useful posts or opportunities.
              </li>
              <li>
                <strong className='text-slate-200 font-mono'>
                  Start with context:
                </strong>{" "}
                Add a thoughtful comment, introduction, or chat request instead
                of sending a generic message.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
