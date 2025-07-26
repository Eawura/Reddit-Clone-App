import { createContext, useContext, useState } from "react";

const defaultProfile = {
  username: "u/User",
  email: "",
  bio: "This is my bio.",
  avatar: "commenter1.jpg",
  location: "",
  website: "",
};

const ProfileContext = createContext({
  profile: defaultProfile,
  setProfile: () => {},
  loading: false,
  error: null,
  refreshProfile: () => {},
  updateProfile: () => {},
});

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading] = useState(false);
  const [error] = useState(null);

  // Local-only update function
  const updateProfile = async (profileData) => {
    setProfile((prev) => ({
      ...prev,
      ...profileData,
    }));
    return { success: true, data: { ...profile, ...profileData } };
  };

  // Local-only refresh (does nothing)
  const refreshProfile = () => {};

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        error,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
