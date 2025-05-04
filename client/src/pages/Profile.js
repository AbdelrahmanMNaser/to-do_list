import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../store/slices/userSlice";

import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

import ProfileSection from "./../components/profile/ProfileSection";
import EditableField from "../components/profile/EditableField";
import Button from "../components/ui/Button";
import Input from "../components/ui/TextInput";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileUpdate = (field, value) => {
    dispatch(
      updateUserProfile({
        id: user._id,
        updates: { [field]: value },
      })
    );
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
  
  const validatePhone = (phone) => {
    if (!phone) return ""; // Phone is optional
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s()-]/g, ''))) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const handlePasswordChange = async () => {
    // Reset errors
    setPasswordError("");

    // Validate
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      // Call your API to change password
      await dispatch(
        updateUserProfile({
          id: user._id,
          updates: {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
        })
      );

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Personal Information Section */}
      <ProfileSection title="Personal Information" icon={<FaUser />}>
        <EditableField
          label="Username"
          value={user?.username || ""}
          onSave={(value) => handleProfileUpdate("username", value)}
          validation={(value) => (!value ? "Username is required" : "")}
        />
        
      </ProfileSection>

      {/* Contact Information Section */}
      <ProfileSection title="Contact Information" icon={<FaEnvelope />}>
        <EditableField
          label="Email Address"
          value={user?.email || ""}
          type="email"
          onSave={(value) => handleProfileUpdate("email", value)}
          validation={validateEmail}
        />
        
        <EditableField
          label="Phone Number"
          value={user?.phone || ""}
          type="tel"
          onSave={(value) => handleProfileUpdate("phone", value)}
          validation={validatePhone}
          placeholder="e.g. +1 234 567 8900"
        />
      </ProfileSection>

      {/* Security Section */}
      <ProfileSection title="Security" icon={<FaLock />}>
        {!isChangingPassword ? (
          <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
            Change Password
          </Button>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            {passwordError && (
              <div className="text-red-500 text-sm mb-4">{passwordError}</div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordError("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePasswordChange}
                disabled={status === "loading"}
              >
                Update Password
              </Button>
            </div>
          </div>
        )}
      </ProfileSection>
    </div>
  );
};

export default Profile;