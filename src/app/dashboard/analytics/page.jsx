import {
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Views", val: "2,408", icon: BarChart3 },
    { label: "Engagement", val: "14.2%", icon: TrendingUp },
    { label: "New Followers", val: "48", icon: Users },
    { label: "Best Time", val: "6:00 PM", icon: Clock },
  ];

  const posts = [
    { title: "Building Digital Futures: The Guide", views: "842" },
    { title: "React Performance Tuning", views: "512" },
    { title: "My 2026 Dev Stack", views: "340" },
  ];

  return (
    <div className='mx-auto max-w-6xl space-y-6 py-8 px-4'>
      <div>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Growth Insights
        </span>
        <h1 className='mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
          Analytics <span className='text-emerald-400'>Dashboard</span>
        </h1>
        <p className='mt-1 text-xs text-slate-500'>
          Understand what resonates with your audience.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'>
            <div className='flex items-center gap-2 text-slate-600'>
              <stat.icon className='h-3.5 w-3.5' />
              <span className='font-mono text-[10px] font-medium uppercase tracking-wider'>
                {stat.label}
              </span>
            </div>
            <p className='mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {/* Top Posts */}
        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'>
          <h2 className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Top Performing Posts
          </h2>
          <div className='mt-4 space-y-2'>
            {posts.map((post) => (
              <div
                key={post.title}
                className='flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950'>
                <span className='text-sm text-slate-700 dark:text-slate-300'>
                  {post.title}
                </span>
                <span className='flex items-center gap-1 font-mono text-xs font-medium text-emerald-400'>
                  {post.views}
                  <ArrowUpRight className='h-3 w-3' />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Tips */}
        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'>
          <h2 className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Growth Tips
          </h2>
          <div className='mt-4 space-y-3 text-xs leading-relaxed text-slate-500'>
            <p>
              Your post{" "}
              <span className='font-medium text-emerald-400'>
                "React Performance"
              </span>{" "}
              is getting 20% more engagement than usual.
            </p>
            <p>
              Posting on{" "}
              <span className='font-medium text-emerald-400'>Tuesdays</span>{" "}
              tends to double your interaction rate.
            </p>
            <p>
              70% of your audience is reading from{" "}
              <span className='font-medium text-emerald-400'>Nigeria</span>.
              Keep your local insights flowing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
