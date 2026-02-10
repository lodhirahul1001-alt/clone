// pages/Support.jsx
import { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Download,
  ExternalLink,
  Users,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Star,
  Send,
  X,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Support() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tickets' | 'faq' | 'contact'
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'Medium',
    category: 'General',
  });

  // Mock data
  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Unable to upload music file',
      description: 'Getting error when trying to upload MP3 file',
      priority: 'High',
      status: 'In Progress',
      createdAt: '2024-12-10T10:30:00Z',
      updatedAt: '2024-12-10T14:20:00Z',
      category: 'Technical',
    },
    {
      id: 'TKT-002',
      subject: 'Payment not reflected',
      description: 'Made payment 2 days ago but still not showing in account',
      priority: 'Critical',
      status: 'Open',
      createdAt: '2024-12-09T16:45:00Z',
      updatedAt: '2024-12-09T16:45:00Z',
      category: 'Billing',
    },
    {
      id: 'TKT-003',
      subject: 'How to add collaborators?',
      description: 'Need help adding other artists to my release',
      priority: 'Low',
      status: 'Resolved',
      createdAt: '2024-12-08T09:15:00Z',
      updatedAt: '2024-12-08T11:30:00Z',
      category: 'General',
    },
  ];

  const faqs = [
    {
      id: 'faq-1',
      question: 'How long does it take to distribute my music?',
      answer:
        'Music distribution typically takes 24-48 hours to major platforms like Spotify, Apple Music, and YouTube Music. Some platforms may take up to 7 days.',
      category: 'Distribution',
      helpful: 45,
    },
    {
      id: 'faq-2',
      question: 'What audio formats do you accept?',
      answer:
        'We accept WAV and MP3 files. For best quality, we recommend uploading WAV files at 44.1kHz/16-bit or higher.',
      category: 'Technical',
      helpful: 38,
    },
    {
      id: 'faq-3',
      question: 'How do I claim my YouTube Content ID?',
      answer:
        'Go to Release Video section, select Content ID tab, and submit your request with the video URL. Our team will process it within 2-3 business days.',
      category: 'YouTube',
      helpful: 52,
    },
    {
      id: 'faq-4',
      question: 'When will I receive my royalties?',
      answer:
        'Royalties are calculated monthly and paid out 60 days after the end of each month. You can track your earnings in the Finance section.',
      category: 'Payments',
      helpful: 67,
    },
    {
      id: 'faq-5',
      question: 'Can I edit my release after submission?',
      answer:
        'Limited edits are possible before distribution. After distribution, only metadata changes are allowed. Contact support for assistance.',
      category: 'Distribution',
      helpful: 29,
    },
  ];

  const categories = ['all', 'General', 'Technical', 'Billing', 'Distribution', 'YouTube', 'Payments'];

  const handleCreateTicket = (e) => {
    e.preventDefault();

    const ticket = {
      ...newTicket,
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating ticket:', ticket);
    setShowTicketModal(false);
    setNewTicket({
      subject: '',
      description: '',
      priority: 'Medium',
      category: 'General',
    });
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+91 9060070222';
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi! I need help with PrDigitalCms. Can you assist me?');
    const whatsappUrl = `https://wa.me/911234567890?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@prdigitalcms.com?subject=Support Request';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Closed':
        return 'bg-gray-200/70 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-200/70 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500 text-[color:var(--text)]';
      case 'High':
        return 'bg-orange-500 text-[color:var(--text)]';
      case 'Medium':
        return 'bg-blue-500 text-[color:var(--text)]';
      case 'Low':
        return 'bg-green-500 text-[color:var(--text)]';
      default:
        return 'bg-gray-500 text-[color:var(--text)]';
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--text)] mb-2">Help & Support Center</h1>
            <p className="text-[color:var(--muted)]">
              Get help, find answers, and connect with our support team
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTicketModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-[color:var(--text)] px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </motion.button>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 glass-soft p-1 rounded-lg border border-[color:var(--border)]">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'tickets', label: 'My Tickets', icon: FileText },
            { id: 'faq', label: 'FAQ', icon: MessageCircle },
            { id: 'contact', label: 'Contact Us', icon: Phone },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-md'
                  : 'text-[color:var(--muted)] hover:text-[color:var(--text)]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 cursor-pointer"
                onClick={handlePhoneCall}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-[color:var(--text)] rounded-full">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">Call Support</h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">+91 90600 70222 </p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs">24/7 Available</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800 cursor-pointer"
                onClick={handleWhatsAppClick}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-600 text-[color:var(--text)] rounded-full">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">WhatsApp</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">Silent Music Group Community</p>
                    <p className="text-green-600 dark:text-green-400 text-xs">Instant Support</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 cursor-pointer"
                onClick={handleEmailClick}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600 text-[color:var(--text)] rounded-full">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Email Support</h3>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">info@silentmusicgroup.com</p>
                    <p className="text-purple-600 dark:text-purple-400 text-xs">Response in 2-4 hours</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Support Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-soft p-6 rounded-lg border border-[color:var(--border)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.5 hrs</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-soft p-6 rounded-lg border border-[color:var(--border)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">98.5%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-soft p-6 rounded-lg border border-[color:var(--border)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">12.5K</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-soft p-6 rounded-lg border border-[color:var(--border)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">4.9/5</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </motion.div>
            </div>

            {/* Popular Resources */}
            <div className="glass-soft rounded-lg border border-[color:var(--border)] p-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-[color:var(--text)]">Popular Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Getting Started Guide', icon: BookOpen, color: 'blue' },
                  { title: 'Video Tutorials', icon: Video, color: 'red' },
                  { title: 'API Documentation', icon: FileText, color: 'green' },
                  { title: 'Community Forum', icon: Users, color: 'purple' },
                  { title: 'Live Chat Support', icon: Headphones, color: 'orange' },
                  { title: 'Knowledge Base', icon: Globe, color: 'teal' },
                ].map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-4 rounded-lg border border-[color:var(--border)] hover:bg-white/5 cursor-pointer transition-all duration-200"
                  >
                    {/* Note: dynamic Tailwind class names below may need safelisting in production */}
                    <div className={`p-2 rounded-lg bg-${resource.color}-100 dark:bg-${resource.color}-900/20`}>
                      <resource.icon className={`w-5 h-5 text-${resource.color}-600 dark:text-${resource.color}-400`} />
                    </div>
                    <span className="font-medium dark:text-[color:var(--text)]">{resource.title}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-ui w-full pl-10 pr-4 py-2"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-ui px-4 py-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-[color:var(--text)]">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Tickets List */}
            <div className="glass-soft rounded-lg border border-[color:var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Ticket ID</th>
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Subject</th>
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Priority</th>
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Created</th>
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <motion.tr
                        key={ticket.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-[color:var(--border)] hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{ticket.id}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium dark:text-[color:var(--text)]">{ticket.subject}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                              {ticket.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-ui w-full pl-10 pr-4 py-3"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-ui px-4 py-3"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-soft rounded-lg border border-[color:var(--border)] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-[color:var(--text)] mb-1">{faq.question}</h3>
                      <div className="flex items-center gap-4 text-sm text-[color:var(--muted)]">
                        <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {faq.helpful} helpful
                        </span>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: expandedFAQ === faq.id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className="w-5 h-5 text-[color:var(--muted)]" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-[color:var(--border)]"
                      >
                        <div className="p-6 bg-[color:var(--panel-soft)]">
                          <p className="text-[color:var(--text)] leading-relaxed">{faq.answer}</p>
                          <div className="mt-4 flex items-center gap-4">
                            <span className="text-sm text-[color:var(--muted)]">Was this helpful?</span>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              >
                                👍
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                👎
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="glass-soft rounded-lg border border-[color:var(--border)] p-6">
                <h2 className="text-xl font-semibold mb-6 dark:text-[color:var(--text)]">Get in Touch</h2>

                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handlePhoneCall}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-3 bg-blue-600 text-[color:var(--text)] rounded-full">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-[color:var(--text)]">Phone Support</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">+91 9060070222</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-3 bg-green-600 text-[color:var(--text)] rounded-full">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-[color:var(--text)]">WhatsApp Community</h3>
                      <p className="text-green-600 dark:text-green-400 font-medium">SMG Support Team </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Join our community for instant help</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handleEmailClick}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200"
                  >
                    <div className="p-3 bg-purple-600 text-[color:var(--text)] rounded-full">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-[color:var(--text)]">Email Support</h3>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">info@silentmusicgroup.com</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response within 2-4 hours</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="glass-soft rounded-lg border border-[color:var(--border)] p-6">
                <h3 className="font-semibold mb-4 dark:text-[color:var(--text)] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Support Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                    <span className="dark:text-[color:var(--text)]">9:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                    <span className="dark:text-[color:var(--text)]">10:00 AM - 4:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                    <span className="text-red-600 dark:text-red-400">Closed</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Emergency Support</span>
                      <span className="text-green-600 dark:text-green-400">24/7 Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="glass-soft rounded-lg border border-[color:var(--border)] p-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-[color:var(--text)]">Quick Message</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    className="input-ui w-full px-3 py-2"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="input-ui w-full px-3 py-2"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    className="input-ui w-full px-3 py-2"
                    placeholder="What can we help you with?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    rows="4"
                    className="input-ui w-full px-3 py-2"
                    placeholder="Describe your issue or question..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-[color:var(--text)] py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Create Ticket Modal */}
        <AnimatePresence>
          {showTicketModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[color:var(--border)]"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold dark:text-[color:var(--text)]">Create Support Ticket</h2>
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="input-ui w-full px-3 py-2"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        className="input-ui w-full px-3 py-2"
                      >
                        {categories.slice(1).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        className="input-ui w-full px-3 py-2"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="input-ui w-full px-3 py-2"
                      placeholder="Provide detailed information about your issue..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachments</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setNewTicket({ ...newTicket, files: e.target.files || undefined })}
                      className="input-ui w-full px-3 py-2"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Max: 5 files, 10MB each. Supported: JPG, PNG, PDF, DOC, TXT
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTicketModal(false)}
                      className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-[color:var(--text)] hover:bg-gray-200/70 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-[color:var(--text)] px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Create Ticket
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
