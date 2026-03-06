import React, { useState, useEffect } from 'react';
import { User, Lock, CreditCard, FileText, Camera, Save, Eye, EyeOff, Upload, Check, X } from 'lucide-react';
import { useFormStorage } from '../hooks/useFormStorage';
import { AutoFillButton } from '../components/AutoFillButton';
import { FormSaveIndicator } from '../components/FormSaveIndicator';
import {
  getProfileApi,
  updatePersonalProfileApi,
  updateBankDetailsApi,
  updatePanDetailsApi,
  changePasswordApi,
  uploadProfilePictureApi,
} from "../../apis/UserApis";

export default function UserProfile() {
  const [profileLoading, setProfileLoading] = useState(true);
const [profileError, setProfileError] = useState("");
const [saveError, setSaveError] = useState("");

  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(undefined);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form storage hooks
  const personalFormStorage = useFormStorage('user-profile-personal');
  const bankFormStorage = useFormStorage('user-profile-bank');
  const panFormStorage = useFormStorage('user-profile-pan');
  const passwordFormStorage = useFormStorage('user-password-change'); // moved here

  const [userInfo, setUserInfo] = useState({});

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: 'Pintu Kumar',
    accountNumber: '1234567890123456',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branchName: 'Connaught Place Branch'
  });

  const [panDetails, setPANDetails] = useState({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");
  
        const res = await getProfileApi(); // GET /user/profile
        const u = res?.user;
        if (u) {
          let firstName = u.firstName || "";
          let lastName = u.lastName || "";
          if ((!firstName || !lastName) && u.fullName) {
            const parts = u.fullName.split(" ");
            firstName = parts[0] || "";
            lastName = parts.slice(1).join(" ") || "";
          }
  
          setUserInfo((prev) => ({
            ...prev,
            firstName,
            lastName,
            email: u.email || "",
            phone: u.phone || "",
            dateOfBirth: u.dateOfBirth
              ? u.dateOfBirth.substring(0, 10)
              : "",
            address: u.address || "",
            city: u.city || "",
            state: u.state || "",
            pincode: u.pincode || "",
            profilePhoto: u.dp || prev.profilePhoto,
          }));
  
          if (u.bankDetails) {
            setBankDetails((prev) => ({
              ...prev,
              ...u.bankDetails,
            }));
          }
  
          if (u.panDetails) {
            setPANDetails((prev) => ({
              ...prev,
              ...u.panDetails,
              dateOfBirth: u.panDetails.dateOfBirth
                ? u.panDetails.dateOfBirth.substring(0, 10)
                : prev.dateOfBirth,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        setProfileError(
          error?.response?.data?.msg || "Failed to load profile"
        );
      } finally {
        setProfileLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  

  useEffect(() => {
    const savedPersonalData = personalFormStorage.getAutoFillData();
    const savedBankData = bankFormStorage.getAutoFillData();
    const savedPanData = panFormStorage.getAutoFillData();

    if (Object.keys(savedPersonalData).length > 0) {
      setUserInfo(prev => ({ ...prev, ...savedPersonalData }));
    }
    if (Object.keys(savedBankData).length > 0) {
      setBankDetails(prev => ({ ...prev, ...savedBankData }));
    }
    if (Object.keys(savedPanData).length > 0) {
      setPANDetails(prev => ({ ...prev, ...savedPanData }));
    }
  }, []);

  // Auto-save when data changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        setIsSaving(true);

        switch (activeTab) {
          case 'personal':
            personalFormStorage.saveFormData(userInfo, 'User Personal Information Form');
            break;
          case 'bank':
            bankFormStorage.saveFormData(bankDetails, 'Bank Account Details Form');
            break;
          case 'pan':
            panFormStorage.saveFormData(panDetails, 'PAN Card Information Form');
            break;
          default:
            break;
        }

        setTimeout(() => {
          setIsSaving(false);
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        }, 500);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [userInfo, bankDetails, panDetails, hasUnsavedChanges, activeTab]);

  const handleSave = async (section) => {
    setSaveStatus("saving");
    setSaveError("");
  
    try {
      if (section === "personal") {
        const payload = {
          firstName: userInfo.firstName?.trim(),
          lastName: userInfo.lastName?.trim(),
          email: userInfo.email?.trim(),
          phone: userInfo.phone?.trim(),
          dateOfBirth: userInfo.dateOfBirth,
          address: userInfo.address?.trim(),
          city: userInfo.city?.trim(),
          state: userInfo.state?.trim(),
          pincode: userInfo.pincode?.trim(),
        };
  
        const res = await updatePersonalProfileApi(payload);
        // optionally sync state with server response
        if (res?.user) {
          // same logic as fetchProfile, but short
        }
  
        personalFormStorage.submitForm(
          userInfo,
          "completed",
          "User Personal Information Form"
        );
      } else if (section === "bank") {
        const payload = {
          ...bankDetails,
          ifscCode: bankDetails.ifscCode?.toUpperCase().trim(),
        };
        await updateBankDetailsApi(payload);
  
        bankFormStorage.submitForm(
          bankDetails,
          "completed",
          "Bank Account Details Form"
        );
      } else if (section === "pan") {
        const payload = {
          ...panDetails,
          panNumber: panDetails.panNumber?.toUpperCase().trim(),
        };
        await updatePanDetailsApi(payload);
  
        panFormStorage.submitForm(
          panDetails,
          "completed",
          "PAN Card Information Form"
        );
      }
  
      setSaveStatus("saved");
      setIsEditing(false);
      setHasUnsavedChanges(false);
  
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Profile save error", error);
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Failed to save. Please try again.";
      setSaveStatus("error");
      setSaveError(msg);
    }
  };
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaveError("");
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveError("New passwords do not match");
      return;
    }
  
    if (passwordData.newPassword.length < 8) {
      setSaveError("Password must be at least 8 characters long");
      return;
    }
  
    try {
      setSaveStatus("saving");
  
      await changePasswordApi({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
  
      // optional meta info local storage
      passwordFormStorage.submitForm(
        {
          passwordChangeDate: new Date().toISOString(),
          passwordStrength:
            passwordData.newPassword.length >= 12 ? "Strong" : "Medium",
        },
        "completed",
        "Password Change Form"
      );
  
      setSaveStatus("saved");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
  
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Password change error", error);
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Failed to change password";
      setSaveStatus("error");
      setSaveError(msg);
    }
  };
  

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      setSaveError("Profile photo must be an image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Profile photo must be less than 5MB");
      return;
    }
  
    // local preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUserInfo((prev) => ({
        ...prev,
        profilePhoto: ev.target?.result,
      }));
    };
    reader.readAsDataURL(file);
  
    try {
      setSaveStatus("saving");
      setSaveError("");
  
      await uploadProfilePictureApi(file); // POST /user/profile-picture
  
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Profile photo upload error", error);
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Failed to upload profile photo";
      setSaveStatus("error");
      setSaveError(msg);
    }
  };
  

  const handlePANImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPANDetails({ ...panDetails, panCardImage: ev.target?.result });
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFillPersonal = (autoFillData) => {
    setUserInfo(prev => ({ ...prev, ...autoFillData }));
    setHasUnsavedChanges(true);
  };

  const handleAutoFillBank = (autoFillData) => {
    setBankDetails(prev => ({ ...prev, ...autoFillData }));
    setHasUnsavedChanges(true);
  };

  const handleAutoFillPAN = (autoFillData) => {
    setPANDetails(prev => ({ ...prev, ...autoFillData }));
    setHasUnsavedChanges(true);
  };

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Saving...
          </>
        );
      case 'saved':
        return (
          <>
            <Check className="w-4 h-4" />
            Saved!
          </>
        );
      case 'error':
        return (
          <>
            <X className="w-4 h-4" />
            Error
          </>
        );
      default:
        return (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        );
    }
  };

  if (profileLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  {profileError && (
    <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      {profileError}
    </div>
  )}
  
  

 return (
<div className="dash-page w-full overflow-x-hidden">

<div className="max-w-4xl w-full mx-auto space-y-4 sm:space-y-6 dash-form">
      {/* Top Header */}
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-[color:var(--text)]">
            User Profile
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
            All changes are automatically saved to Form Data Manager
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <FormSaveIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          {saveStatus === "saved" && (
            <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Changes saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {[
            { id: "personal", label: "Personal Info", icon: User },
            { id: "password", label: "Password", icon: Lock },
            { id: "bank", label: "Bank Details", icon: CreditCard },
            { id: "pan", label: "PAN Card", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border-b-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-[color:var(--text)]"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Information Tab */}
      {activeTab === "personal" && (
        <div className="dash-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[color:var(--text)]">
              Personal Information
            </h2>
            <div className="flex items-center gap-2">
              <AutoFillButton
                onAutoFill={handleAutoFillPersonal}
                formType="user-profile-personal"
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          {/* Profile Photo Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="relative">
              <img
                src={
                  userInfo.profilePhoto ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-[color:var(--text)] p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-[color:var(--text)]">
                {userInfo.firstName} {userInfo.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userInfo.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                All data automatically saved to Form Manager
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              ["First Name", "firstName", "text"],
              ["Last Name", "lastName", "text"],
              ["Email", "email", "email"],
              ["Phone", "phone", "tel"],
              ["Date of Birth", "dateOfBirth", "date"],
              ["Address", "address", "text"],
              ["City", "city", "text"],
              ["State", "state", "text"],
              ["PIN Code", "pincode", "text"],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={userInfo[key]}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, [key]: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-[color:var(--text)] disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleSave("personal")}
                disabled={saveStatus === "saving"}
                className="bg-blue-600 text-[color:var(--text)] px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {getSaveButtonContent()}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="dash-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-[color:var(--text)]">
            Change Password
          </h2>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-4 max-w-md text-sm"
          >
            {/* Current Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10 dark:bg-gray-700 dark:text-[color:var(--text)]"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      current: !showPassword.current,
                    })
                  }
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10 dark:bg-gray-700 dark:text-[color:var(--text)]"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      new: !showPassword.new,
                    })
                  }
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10 dark:bg-gray-700 dark:text-[color:var(--text)]"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirm: !showPassword.confirm,
                    })
                  }
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="bg-blue-600 text-[color:var(--text)] px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {getSaveButtonContent()}
            </button>
            {saveError && (
              <p className="text-xs text-red-600 mt-1">{saveError}</p>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password change details will be saved to Form Data Manager
            </p>
          </form>
        </div>
      )}

      {/* Bank Details Tab */}
      {activeTab === "bank" && (
        <div className="dash-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[color:var(--text)]">
              Bank Account Details
            </h2>
            <div className="flex items-center gap-2">
              <AutoFillButton
                onAutoFill={handleAutoFillBank}
                formType="user-profile-bank"
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              ["Account Holder Name", "accountHolderName"],
              ["Account Number", "accountNumber"],
              ["IFSC Code", "ifscCode"],
              ["Bank Name", "bankName"],
              ["Branch Name", "branchName"],
            ].map(([label, key], idx) => (
              <div key={key} className={idx === 4 ? "md:col-span-2" : ""}>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={bankDetails[key]}
                  onChange={(e) => {
                    const val =
                      key === "ifscCode"
                        ? e.target.value.toUpperCase()
                        : e.target.value;
                    setBankDetails({ ...bankDetails, [key]: val });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-[color:var(--text)] disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleSave("bank")}
                disabled={saveStatus === "saving"}
                className="bg-blue-600 text-[color:var(--text)] px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {getSaveButtonContent()}
              </button>
            </div>
          )}
        </div>
      )}

      {/* PAN Card Tab */}
      {activeTab === "pan" && (
        <div className="dash-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[color:var(--text)]">
              PAN Card Details
            </h2>
            <div className="flex items-center gap-2">
              <AutoFillButton
                onAutoFill={handleAutoFillPAN}
                formType="user-profile-pan"
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          {/* PAN Card Image Section */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              PAN Card Image
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {panDetails.panCardImage && (
                <img
                  src={panDetails.panCardImage}
                  alt="PAN Card"
                  className="w-40 h-28 sm:w-48 sm:h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
              )}
              {isEditing && (
                <label className="bg-blue-600 text-[color:var(--text)] px-3 sm:px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs sm:text-sm">
                  <Upload className="w-4 h-4" />
                  Upload PAN Card
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePANImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PAN Number
              </label>
              <input
                type="text"
                value={panDetails.panNumber}
                onChange={(e) => {
                  setPANDetails({
                    ...panDetails,
                    panNumber: e.target.value.toUpperCase(),
                  });
                  setHasUnsavedChanges(true);
                }}
                disabled={!isEditing}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                maxLength={10}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-[color:var(--text)] disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: ABCDE1234F
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PAN Holder Name
              </label>
              <input
                type="text"
                value={panDetails.panHolderName}
                onChange={(e) => {
                  setPANDetails({
                    ...panDetails,
                    panHolderName: e.target.value,
                  });
                  setHasUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-[color:var(--text)] disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Father&apos;s Name
              </label>
              <input
                type="text"
                value={panDetails.fatherName}
                onChange={(e) => {
                  setPANDetails({
                    ...panDetails,
                    fatherName: e.target.value,
                  });
                  setHasUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-[color:var(--text)] disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth (as per PAN)
              </label>
              <input
                type="date"
                value={panDetails.dateOfBirth}
                onChange={(e) => {
                  setPANDetails({
                    ...panDetails,
                    dateOfBirth: e.target.value,
                  });
                  setHasUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-[color:var(--text)] disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleSave("pan")}
                disabled={saveStatus === "saving"}
                className="bg-blue-600 text-[color:var(--text)] px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {getSaveButtonContent()}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

}
