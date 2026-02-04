import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
// adjust path if needed

const pricingPlans = [
  {
    name: " Artist",
    price: "70%",
    period: "/Artist",
    description: "The MUST have plan for professional artists and labels.",
    highlight: "BEST DEAL!",
    color: "from-yellow-400 to-orange-500",
    buttonColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
    features: [
      "Unlimited Release",
      "200+ Store",
      "Premium Features",
      "48 Hours Support",
      "Store Automator",
      "Official Artist Channel",
    ],
  },
  {
    name: "Lable ",
    price: "75%",
    period: "/Lable",
    description:
      "Release unlimited music plus advanced features to customize your releases.",
    color: "from-pink-500 to-purple-500",
    buttonColor: "bg-gradient-to-r from-pink-500 to-purple-500",
    features: [
      "Unlimited Artist",
      "Unlimited Music Distribution",
      "24 Hours Support",
      "Advanced Analytics",
      "Social Media Integration",
      "Official Artist Channel",
    ],
  },
  {
    name: "Unlimited Lable",
    price: "80%",
    period: "/Label",
    description:
      "The essential distribution plan. Release unlimited music to 150+ Digital Stores across the globe.",
    color: "from-blue-400 to-blue-600",
    buttonColor: "bg-gradient-to-r from-blue-400 to-blue-600",
    features: [
      "All Premium Features",
      "Custom Dashboard on Your Domain",
      "Your Brand & Logo",
      "Custom Payment Integration",
      "Multi-User Management",
      "Digital Store Access",
    ],
  },
];

const features = [
  "Official Sales Reports",
  "100% Revenue from Digital Stores",
  "Schedule Your Own Release Date",
  "Unlimited Releases to all Digital Stores",
  "Spotify Verified Artist Checkmark",
  "Apple Music for Artists Verification",
  "Artist Revenue Splits",
  "Unlimited Releases to all Social Platforms",
  "Store Automator",
  "Daily Trend Reports",
  "Cover Art Creator",
  "Use Your Own ISRC",
];

export default function HomeDashboard() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white pt-24 pb-16 transition-colors duration-300">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Choose the Right Plan for Your{" "}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Music Distribution
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Select from our range of distribution plans designed to fit your music
          career stage
        </motion.p>
      </div>

      {/* Toggle Section */}
      <div className="flex justify-center mb-16">
        <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-full inline-flex">
          <button className="px-6 py-2 rounded-full bg-white text-black font-medium dark:bg-white dark:text-black">
            UNLIMITED LABLE
          </button>
          <button className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            UNLIMITED ARTIST
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg"
            >
              {plan.highlight && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full">
                  {plan.highlight}
                </div>
              )}
              <div className="p-8 border border-gray-300 dark:border-gray-800 rounded-2xl transition-transform hover:scale-105 duration-300">
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold" />
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[60px]">
                  {plan.description}
                </p>
                <button
                  className={`w-full py-3 rounded-lg text-white font-medium mb-8 ${plan.buttonColor} hover:opacity-90 transition-opacity`}
                >
                  GET STARTED
                </button>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <Check className="w-5 h-5 mr-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-end pr-6 mt-10">
          <ThemeToggle />
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-24 bg-white dark:bg-gray-900 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Compare All Features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                  <th className="py-4 px-6 text-left">Features</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.name} className="py-4 px-6 text-center">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 dark:border-gray-800"
                  >
                    <td className="py-4 px-6">{feature}</td>
                    {pricingPlans.map((plan) => (
                      <td
                        key={`${plan.name}-${feature}`}
                        className="py-4 px-6 text-center"
                      >
                        <Check className="w-5 h-5 mx-auto text-green-500" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
