import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, updateProfile } from "../utils/api"; // adjust path

const defaultProfile = {
  username: "u/User",
  displayName: "User",
  bio: "This is my bio.",
  avatar: "commenter1.jpg",
};

const ProfileContext = createContext({
  profile: defaultProfile,
  setProfile: () => {},
  saveProfile: async () => {},
});

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        // handle error (optional)
      }
    }
    fetchProfile();
  }, []);

  // Save handler to update profile in backend and context
  const saveProfile = async (updatedProfile) => {
    console.log('Saving profile with data:', updatedProfile);
    try {
      const saved = await updateProfile(updatedProfile);
      console.log('Profile saved successfully:', saved);
      setProfile(saved);
      return saved;
    } catch (error) {
      console.error('Error saving profile:', {
        message: error.message,
        error: error,
        response: error.response?.data,
        stack: error.stack
      });
      throw error;
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}

function App() {
  const { setProfile } = useProfile();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getProfile();
        setProfile(profile);
      } catch (err) {
        // handle error
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (updatedProfile) => {
    try {
      const saved = await updateProfile(updatedProfile);
      setProfile(saved); // update context with new profile
    } catch (err) {
      // handle error
    }
  };
  // ...
}
