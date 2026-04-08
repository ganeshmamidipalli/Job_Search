import { getProfile } from '@/lib/data';
import ReactMarkdown from 'react-markdown';

export default function ProfilePage() {
  const profile = getProfile();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Profile</h1>
        <p className="text-gray-400 mt-1">Your career profile and skills</p>
      </div>

      {/* Profile header */}
      <div className="bg-surface rounded-xl border border-surface-light/30 p-6 mb-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-2xl font-bold text-accent">
            {profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-100">{profile.fullName || 'Not configured'}</h2>
            {profile.headline && (
              <p className="text-gray-300 mt-1">{profile.headline}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              {profile.email && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profile.email}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {profile.phone}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {profile.linkedin && (
                <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:text-accent-light">
                  LinkedIn
                </a>
              )}
              {profile.portfolio && (
                <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:text-accent-light">
                  Portfolio
                </a>
              )}
              {profile.github && (
                <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:text-accent-light">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Roles */}
        <div className="bg-surface rounded-xl border border-surface-light/30 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Target Roles</h3>
          {profile.targetRoles.length === 0 ? (
            <p className="text-gray-500 text-sm">No target roles configured</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.targetRoles.map((role, i) => (
                <span key={i} className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-lg text-sm">
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Compensation */}
        <div className="bg-surface rounded-xl border border-surface-light/30 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Compensation Target</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-400">Target Range</span>
              <p className="text-xl font-semibold text-emerald-400">{profile.compensation.target || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Minimum</span>
              <p className="text-lg text-gray-300">{profile.compensation.minimum || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Superpowers */}
        <div className="bg-surface rounded-xl border border-surface-light/30 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Superpowers</h3>
          {profile.superpowers.length === 0 ? (
            <p className="text-gray-500 text-sm">Not configured</p>
          ) : (
            <ul className="space-y-3">
              {profile.superpowers.map((sp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-accent mt-0.5 shrink-0">&#9654;</span>
                  {sp}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Proof Points */}
        <div className="bg-surface rounded-xl border border-surface-light/30 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Proof Points</h3>
          {profile.proofPoints.length === 0 ? (
            <p className="text-gray-500 text-sm">Not configured</p>
          ) : (
            <div className="space-y-4">
              {profile.proofPoints.map((pp, i) => (
                <div key={i} className="border-l-2 border-accent/40 pl-3">
                  <p className="text-sm font-medium text-gray-200">{pp.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{pp.metric}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills from CV */}
      {Object.keys(profile.skills).length > 0 && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profile.skills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-accent mb-1">{category}</h4>
                <p className="text-sm text-gray-400">{skills}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exit Story */}
      {profile.exitStory && (
        <div className="bg-surface rounded-xl border border-surface-light/30 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Career Narrative</h3>
          <p className="text-gray-300 leading-relaxed">{profile.exitStory}</p>
        </div>
      )}
    </div>
  );
}
