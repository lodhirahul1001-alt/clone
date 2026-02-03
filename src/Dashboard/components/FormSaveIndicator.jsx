import React, { useEffect, useState } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

export function FormSaveIndicator({ isSaving, lastSaved, hasUnsavedChanges }) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <AnimatePresence mode="wait">
        {isSaving && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Save className="w-4 h-4" />
            </motion.div>
            <span>Saving...</span>
          </motion.div>
        )}

        {showSaved && !isSaving && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 text-green-600 dark:text-green-400"
          >
            <Check className="w-4 h-4" />
            <span>Saved</span>
          </motion.div>
        )}

        {hasUnsavedChanges && !isSaving && !showSaved && (
          <motion.div
            key="unsaved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Unsaved changes</span>
          </motion.div>
        )}

        {lastSaved && !hasUnsavedChanges && !isSaving && !showSaved && (
          <motion.div
            key="last-saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-gray-500 dark:text-gray-400"
          >
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ Prop validation
FormSaveIndicator.propTypes = {
  isSaving: PropTypes.bool.isRequired,
  lastSaved: PropTypes.instanceOf(Date),
  hasUnsavedChanges: PropTypes.bool.isRequired,
};
