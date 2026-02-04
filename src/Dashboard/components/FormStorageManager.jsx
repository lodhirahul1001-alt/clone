// components/FormStorageManager.jsx
import React, { useState } from 'react';
import {
  Save,
  Download,
  Trash2,
  Eye,
  Edit,
  Search,
  Calendar,
  FileText,
  Music,
  Video,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Copy,
  RefreshCw,
  BarChart3,
  Database,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormStorage } from '../hooks/useFormStorage';

export function FormStorageManager({ isOpen, onClose }) {
  const {
    getAllSubmissions,
    deleteSubmission,
    updateSubmissionStatus,
    userProfile,
    getFormStatistics,
    exportAllData,
  } = useFormStorage('manager');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'profile' | 'statistics'

  const allSubmissions = getAllSubmissions();
  const statistics = getFormStatistics();

  const filteredSubmissions = allSubmissions.filter((submission) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      submission.formType.toLowerCase().includes(q) ||
      submission.formTitle.toLowerCase().includes(q) ||
      JSON.stringify(submission.data).toLowerCase().includes(q) ||
      (submission.userInfo?.name || '').toLowerCase().includes(q) ||
      (submission.userInfo?.email || '').toLowerCase().includes(q);

    const matchesType = filterType === 'all' || submission.formType === filterType;
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getFormIcon = (formType) => {
    const t = formType.toLowerCase();
    if (t.includes('music') || t.includes('track') || t.includes('release')) return <Music className="w-4 h-4" />;
    if (t.includes('video')) return <Video className="w-4 h-4" />;
    if (t.includes('user') || t.includes('profile')) return <User className="w-4 h-4" />;
    if (t.includes('bank') || t.includes('payment')) return <CreditCard className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'submitted':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const copyToClipboard = (data) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    } catch {
      // no-op
    }
  };

  const formTypes = [...new Set(allSubmissions.map((s) => s.formType))];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-transparent rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold dark:text-white">Complete Form Data Manager</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All user form submissions and data in one place
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportAllData}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export All Data
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'submissions', label: 'Form Submissions', icon: FileText },
              { id: 'profile', label: 'User Profile Data', icon: User },
              { id: 'statistics', label: 'Statistics', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Statistics */}
          {activeTab === 'statistics' && (
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Total Forms</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{statistics.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{statistics.completed}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Drafts</p>
                      <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{statistics.drafts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Form Types</p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{statistics.formTypes}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Type Breakdown */}
              <div className="bg-transparent rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Form Type Breakdown</h3>
                <div className="space-y-3">
                  {formTypes.map((type) => {
                    const count = allSubmissions.filter((s) => s.formType === type).length;
                    const percentage = statistics.total ? (count / statistics.total) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFormIcon(type)}
                          <span className="dark:text-white capitalize">{type.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm font-medium dark:text-white w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="bg-transparent rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold dark:text-white">Complete User Profile Data</h3>
                  <button
                    onClick={() => copyToClipboard(userProfile)}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Profile Data
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(userProfile).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm font-medium dark:text-white mt-1 break-words">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(userProfile).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No user profile data available yet</p>
                    <p className="text-sm">Data will appear as users fill out forms</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submissions */}
          {activeTab === 'submissions' && (
            <div className="flex h-[70vh]">
              {/* List */}
              <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                <div className="p-4">
                  {/* Filters */}
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search all form data..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      >
                        <option value="all">All Form Types</option>
                        {formTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.replace('-', ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>

                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Form Submissions ({filteredSubmissions.length})
                  </h3>

                  <div className="space-y-2">
                    {filteredSubmissions.map((submission, index) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowDetails(true);
                        }}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getFormIcon(submission.formType)}
                            <span className="font-medium text-sm dark:text-white">
                              {submission.formTitle}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                submission.status
                              )}`}
                            >
                              {submission.status}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(submission.timestamp).toLocaleString()}
                          </div>
                          {submission.userInfo?.name && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {submission.userInfo.name}
                            </div>
                          )}
                          <div>{Object.keys(submission.data).length} fields captured</div>
                        </div>
                      </motion.div>
                    ))}

                    {filteredSubmissions.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No form submissions found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="w-1/2 overflow-y-auto">
                <div className="p-4">
                  {showDetails && selectedSubmission ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Complete Form Data</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(selectedSubmission)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Copy all data"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSubmission(selectedSubmission.id)}
                            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete submission"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Form Info */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Form Information</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Form Type:</span>
                              <p className="font-medium dark:text-white">{selectedSubmission.formType}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Form Title:</span>
                              <p className="font-medium dark:text-white">{selectedSubmission.formTitle}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Status:</span>
                              <p className="font-medium dark:text-white">{selectedSubmission.status}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Submitted:</span>
                              <p className="font-medium dark:text-white">
                                {new Date(selectedSubmission.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {selectedSubmission.userInfo?.name && (
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">User:</span>
                                <p className="font-medium dark:text-white">{selectedSubmission.userInfo.name}</p>
                              </div>
                            )}
                            {selectedSubmission.userInfo?.email && (
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                <p className="font-medium dark:text-white">{selectedSubmission.userInfo.email}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* All Form Data */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">All Captured Data</h4>
                          <div className="space-y-3">
                            {Object.entries(selectedSubmission.data).map(([key, value]) => (
                              <div key={key} className="border-b border-gray-200 dark:border-gray-600 pb-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-sm font-medium dark:text-white mt-1 break-words">
                                  {typeof value === 'boolean'
                                    ? value
                                      ? 'Yes'
                                      : 'No'
                                    : typeof value === 'object'
                                    ? JSON.stringify(value, null, 2)
                                    : value || 'Not provided'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Management */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Manage Status</h4>
                          <div className="flex gap-2">
                            <select
                              value={selectedSubmission.status}
                              onChange={(e) =>
                                updateSubmissionStatus(selectedSubmission.id, e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                            >
                              <option value="draft">Draft</option>
                              <option value="submitted">Submitted</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              onClick={() =>
                                updateSubmissionStatus(selectedSubmission.id, selectedSubmission.status)
                              }
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Select a form submission to view complete data</p>
                      <p className="text-sm">All form fields and user data will be displayed here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
