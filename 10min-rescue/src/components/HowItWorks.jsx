const channels = [
  {
    badge: 'Channel 1',
    title: 'Emergency SOS',
    description: 'Open /sos, describe emergency, pick ambulance type & hospital. GPS captured automatically.',
    href: '/sos',
    cta: 'Try SOS →',
    accent: 'from-red-500 to-red-600',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    badge: 'Channel 2',
    title: 'Callback Request',
    description: 'Can\'t use SOS? Drop name + phone at /callback. Our dispatcher calls within 2 minutes.',
    href: '/callback',
    cta: 'Request Callback →',
    accent: 'from-blue-500 to-blue-600',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    badge: 'Channel 3',
    title: 'WhatsApp / Call',
    description: 'Message us on WhatsApp or dial the number. Auto-reply sends you the SOS link instantly.',
    href: 'https://wa.me/917866067136',
    cta: 'Open WhatsApp →',
    accent: 'from-green-500 to-emerald-600',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
]

const flowSteps = [
  { num: '1', label: 'Patient', detail: 'sends SOS', emoji: '👤' },
  { num: '2', label: 'Driver', detail: 'accepts request', emoji: '🚑' },
  { num: '3', label: 'Hospital', detail: 'pre-alerted', emoji: '🏥' },
  { num: '4', label: 'Live track', detail: 'real-time map', emoji: '📍' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 fade-in">
          <span className="inline-block text-brand-red font-semibold text-sm tracking-wider uppercase mb-3">
            3 Ways to Reach Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy mb-4 leading-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Pick the channel that works for you. Help reaches you in minutes — guaranteed.
          </p>
        </div>

        {/* 3 Channel Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 mb-16">
          {channels.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="fade-in group relative bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Top gradient strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.accent}`} />

              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                {c.badge}
              </span>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.accent} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {c.icon}
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">{c.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm mb-4">{c.description}</p>
              <div className="text-brand-red font-bold text-sm group-hover:translate-x-1 transition-transform">
                {c.cta}
              </div>
            </a>
          ))}
        </div>

        {/* The complete flow */}
        <div className="fade-in bg-gradient-to-br from-navy via-navy-light to-navy rounded-3xl p-6 sm:p-8 lg:p-12 text-white shadow-2xl">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-brand-red font-semibold text-xs tracking-widest uppercase mb-2">
              End-to-End Flow
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">From SOS to Hospital — Live</h3>
            <p className="text-white/60 text-sm mt-2">Everything updates in real-time. Patient & hospital both see status.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {flowSteps.map((s, i) => (
              <div key={s.num} className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 text-center group hover:bg-white/10 transition-colors">
                <div className="text-3xl sm:text-4xl mb-2">{s.emoji}</div>
                <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-1">Step {s.num}</div>
                <div className="font-bold text-white text-sm sm:text-base">{s.label}</div>
                <div className="text-white/50 text-xs">{s.detail}</div>
                {/* Arrow on desktop only */}
                {i < flowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 text-white/20 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
