import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface FormData {
  [key: string]: any;
}

interface FormSubmission {
  id: string;
  formType: string;
  formTitle: string;
  data: FormData;
  timestamp: string;
  status: 'draft' | 'submitted' | 'completed';
  userInfo?: {
    name?: string;
    email?: string;
    userId?: string;
  };
}

interface UserProfile {
  // Personal Information
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  
  // Bank Details
  bankAccountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  
  // PAN Details
  panNumber?: string;
  panHolderName?: string;
  fatherName?: string;
  
  // Music Related
  primaryArtist?: string;
  label?: string;
  genre?: string;
  producer?: string;
  composer?: string;
  lyricist?: string;
  
  // Any other fields from forms
  [key: string]: any;
}

export function useFormStorage(formType: string) {
  // Store all form submissions with detailed tracking
  const [formSubmissions, setFormSubmissions] = useLocalStorage<FormSubmission[]>('prdigital_all_form_submissions', []);
  
  // Store comprehensive user profile built from all forms
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('prdigital_complete_user_profile', {});
  
  // Store current form data with auto-save
  const [currentFormData, setCurrentFormData] = useLocalStorage<FormData>(`prdigital_current_form_${formType}`, {});

  // Enhanced form data saving with comprehensive field capture
  const saveFormData = useCallback((data: FormData, formTitle?: string) => {
    // Save current form data
    setCurrentFormData(data);
    
    // Extract and update user profile with ANY matching fields
    const profileUpdates: UserProfile = {};
    
    // Define all possible profile fields that we want to capture
    const profileFieldMappings = {
      // Personal Info
      'firstName': 'firstName',
      'lastname': 'lastName',
      'lastName': 'lastName',
      'email': 'email',
      'emailAddress': 'email',
      'phone': 'phone',
      'phoneNumber': 'phone',
      'mobile': 'phone',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'pincode': 'pincode',
      'zipCode': 'pincode',
      'dateOfBirth': 'dateOfBirth',
      'dob': 'dateOfBirth',
      
      // Bank Details
      'accountNumber': 'bankAccountNumber',
      'bankAccountNumber': 'bankAccountNumber',
      'ifscCode': 'ifscCode',
      'ifsc': 'ifscCode',
      'accountHolderName': 'accountHolderName',
      'bankName': 'bankName',
      'branchName': 'branchName',
      
      // PAN Details
      'panNumber': 'panNumber',
      'pan': 'panNumber',
      'panHolderName': 'panHolderName',
      'fatherName': 'fatherName',
      
      // Music Related
      'primaryArtist': 'primaryArtist',
      'artist': 'primaryArtist',
      'artistName': 'primaryArtist',
      'label': 'label',
      'recordLabel': 'label',
      'genre': 'genre',
      'musicGenre': 'genre',
      'producer': 'producer',
      'composer': 'composer',
      'lyricist': 'lyricist',
      'title': 'lastTrackTitle',
      'trackTitle': 'lastTrackTitle',
      'albumTitle': 'lastAlbumTitle',
      'releaseDate': 'lastReleaseDate',
      
      // Additional fields
      'upcEan': 'lastUpcEan',
      'isrcCode': 'lastIsrcCode',
      'featuring': 'lastFeaturing',
      'arranger': 'lastArranger',
      'pLine': 'lastPLine',
      'cLine': 'lastCLine',
      'lyricsLanguage': 'lastLyricsLanguage',
      'titleLanguage': 'lastTitleLanguage',
      'productionYear': 'lastProductionYear'
    };
    
    // Update profile with any matching fields
    Object.keys(data).forEach(fieldKey => {
      const value = data[fieldKey];
      if (value && value !== '' && value !== null && value !== undefined) {
        // Direct mapping
        if (profileFieldMappings[fieldKey]) {
          profileUpdates[profileFieldMappings[fieldKey]] = value;
        }
        
        // Also store original field names for complete data capture
        profileUpdates[fieldKey] = value;
      }
    });
    
    // Update user profile if we have new data
    if (Object.keys(profileUpdates).length > 0) {
      setUserProfile(prev => ({ 
        ...prev, 
        ...profileUpdates,
        lastUpdated: new Date().toISOString(),
        lastFormType: formType,
        lastFormTitle: formTitle || formType
      }));
    }
    
    // Create a draft submission entry for tracking
    const draftSubmission: FormSubmission = {
      id: `draft_${formType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      formType,
      formTitle: formTitle || formType.replace('-', ' ').toUpperCase(),
      data: { ...data },
      timestamp: new Date().toISOString(),
      status: 'draft',
      userInfo: {
        name: profileUpdates.firstName && profileUpdates.lastName 
          ? `${profileUpdates.firstName} ${profileUpdates.lastName}` 
          : profileUpdates.primaryArtist || 'Unknown User',
        email: profileUpdates.email || userProfile.email,
        userId: `user_${Date.now()}`
      }
    };
    
    // Update or add draft submission
    setFormSubmissions(prev => {
      const existingDraftIndex = prev.findIndex(
        sub => sub.formType === formType && sub.status === 'draft'
      );
      
      if (existingDraftIndex >= 0) {
        // Update existing draft
        const updated = [...prev];
        updated[existingDraftIndex] = draftSubmission;
        return updated;
      } else {
        // Add new draft
        return [...prev, draftSubmission];
      }
    });
    
  }, [formType, setCurrentFormData, userProfile, setUserProfile, setFormSubmissions]);

  // Submit form with complete data capture
  const submitForm = useCallback((data: FormData, status: 'submitted' | 'completed' = 'submitted', formTitle?: string) => {
    // First save the data to profile
    saveFormData(data, formTitle);
    
    const submission: FormSubmission = {
      id: `${formType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      formType,
      formTitle: formTitle || formType.replace('-', ' ').toUpperCase(),
      data: { ...data },
      timestamp: new Date().toISOString(),
      status,
      userInfo: {
        name: data.firstName && data.lastName 
          ? `${data.firstName} ${data.lastName}` 
          : data.primaryArtist || userProfile.firstName && userProfile.lastName
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : 'Unknown User',
        email: data.email || userProfile.email || 'No email provided',
        userId: `user_${Date.now()}`
      }
    };
    
    // Remove any existing draft for this form type
    setFormSubmissions(prev => {
      const withoutDrafts = prev.filter(
        sub => !(sub.formType === formType && sub.status === 'draft')
      );
      return [...withoutDrafts, submission];
    });
    
    // Clear current form data after successful submission
    setCurrentFormData({});
    
    return submission.id;
  }, [formType, saveFormData, userProfile, setFormSubmissions, setCurrentFormData]);

  // Get auto-fill suggestions with intelligent field mapping
  const getAutoFillData = useCallback(() => {
    const autoFillData = { ...userProfile, ...currentFormData };
    
    // Add intelligent suggestions based on form type
    if (formType.includes('music') || formType.includes('track') || formType.includes('release')) {
      return {
        ...autoFillData,
        // Music-specific auto-fill
        primaryArtist: autoFillData.primaryArtist || autoFillData.artistName || autoFillData.artist,
        label: autoFillData.label || autoFillData.recordLabel,
        producer: autoFillData.producer || autoFillData.lastProducer,
        composer: autoFillData.composer || autoFillData.lastComposer,
        lyricist: autoFillData.lyricist || autoFillData.lastLyricist,
        genre: autoFillData.genre || autoFillData.musicGenre || autoFillData.lastGenre,
      };
    }
    
    if (formType.includes('bank') || formType.includes('payment')) {
      return {
        ...autoFillData,
        // Bank-specific auto-fill
        accountHolderName: autoFillData.accountHolderName || `${autoFillData.firstName || ''} ${autoFillData.lastName || ''}`.trim(),
        accountNumber: autoFillData.bankAccountNumber || autoFillData.accountNumber,
        ifscCode: autoFillData.ifscCode || autoFillData.ifsc,
      };
    }
    
    return autoFillData;
  }, [userProfile, currentFormData, formType]);

  // Clear form data
  const clearFormData = useCallback(() => {
    setCurrentFormData({});
  }, [setCurrentFormData]);

  // Get submissions for specific form type
  const getFormSubmissions = useCallback(() => {
    return formSubmissions.filter(submission => submission.formType === formType);
  }, [formSubmissions, formType]);

  // Get ALL submissions across all forms
  const getAllSubmissions = useCallback(() => {
    return formSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [formSubmissions]);

  // Delete a specific submission
  const deleteSubmission = useCallback((submissionId: string) => {
    setFormSubmissions(prev => prev.filter(submission => submission.id !== submissionId));
  }, [setFormSubmissions]);

  // Update submission status
  const updateSubmissionStatus = useCallback((submissionId: string, status: FormSubmission['status']) => {
    setFormSubmissions(prev => 
      prev.map(submission => 
        submission.id === submissionId 
          ? { ...submission, status, timestamp: new Date().toISOString() }
          : submission
      )
    );
  }, [setFormSubmissions]);

  // Get form statistics
  const getFormStatistics = useCallback(() => {
    const total = formSubmissions.length;
    const completed = formSubmissions.filter(s => s.status === 'completed').length;
    const submitted = formSubmissions.filter(s => s.status === 'submitted').length;
    const drafts = formSubmissions.filter(s => s.status === 'draft').length;
    const formTypes = [...new Set(formSubmissions.map(s => s.formType))].length;
    
    return {
      total,
      completed,
      submitted,
      drafts,
      formTypes,
      profileFields: Object.keys(userProfile).length
    };
  }, [formSubmissions, userProfile]);

  // Export all data
  const exportAllData = useCallback(() => {
    const exportData = {
      userProfile,
      formSubmissions,
      statistics: getFormStatistics(),
      exportDate: new Date().toISOString(),
      totalForms: formSubmissions.length
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prdigital_complete_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [userProfile, formSubmissions, getFormStatistics]);

  return {
    // Current form data
    currentFormData,
    userProfile,
    
    // Form operations
    saveFormData,
    submitForm,
    getAutoFillData,
    clearFormData,
    
    // Data retrieval
    getFormSubmissions,
    getAllSubmissions,
    getFormStatistics,
    
    // Management operations
    deleteSubmission,
    updateSubmissionStatus,
    exportAllData,
    
    // Profile management
    setUserProfile
  };
}