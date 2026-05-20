const stats = [
  { value: '10+', label: 'Ambulances Onboarded', icon: '🚑' },
  { value: '24/7', label: 'Emergency Support', icon: '⏰' },
  { value: '5+', label: 'Hospital Partners', icon: '🏥' },
  { value: '<10', label: 'Min Avg Response', icon: '⚡' },
]

export default function Trust() {
  return (
    <section id="trust" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="fade-in-left">
            <span className="inline-block text-brand-red font-semibold text-sm tracking-wider uppercase mb-3">
              Our Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-6">
              Building a Trusted
              <span className="text-brand-red"> Ambulance Network</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              We are building a network of verified ambulance providers and healthcare partners to ensure
              you get the fastest, most reliable emergency response possible. Every provider in our network
              is checked for proper licensing, equipment, and trained medical staff.
            </p>

            <div className="space-y-4">
              {[
                'Licensed & verified ambulance providers',
                'Equipped with essential medical supplies',
                'Trained drivers and paramedic staff',
                'Coordinated hospital communication',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-navy/80 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats Grid */}
          <div className="fade-in-right">
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-light-bg rounded-2xl p-4 sm:p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <span className="text-2xl sm:text-4xl mb-2 sm:mb-3 block">{stat.icon}</span>
                  <span className="text-2xl sm:text-4xl font-black text-navy block mb-1 sm:mb-2">
                    {stat.value}
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Partner logos placeholder */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-light-bg rounded-2xl border border-gray-100 text-center">
              <p className="text-xs sm:text-sm text-gray-400 font-medium mb-3 sm:mb-4">Trusted by Healthcare Partners</p>
              <div className="flex justify-center items-center gap-4 sm:gap-8 opacity-40">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="w-10 sm:w-16 h-6 sm:h-8 bg-gray-300 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
