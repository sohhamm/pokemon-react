import { BarChart3, Grid3X3, GitBranch, Clock } from "lucide-react"
import Link from "next/link"

export function AppNavigation() {
  const navItems = [
    {
      href: "/stats",
      label: "Stats Dashboard",
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-600",
      description: "Compare Pokemon statistics",
    },
    {
      href: "/types",
      label: "Type Matrix",
      icon: Grid3X3,
      gradient: "from-purple-500 to-pink-600",
      description: "Type effectiveness chart",
    },
    {
      href: "/evolution",
      label: "Evolution Trees",
      icon: GitBranch,
      gradient: "from-green-500 to-emerald-600",
      description: "Evolution chains",
    },
    {
      href: "/timeline",
      label: "Timeline",
      icon: Clock,
      gradient: "from-orange-500 to-red-600",
      description: "Pokemon through generations",
    },
  ]

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                />

                {/* Content */}
                <div className="relative p-6 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700">{item.description}</p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-xl transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
