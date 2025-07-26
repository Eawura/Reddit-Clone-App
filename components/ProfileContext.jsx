import React, { createContext, useContext, useState } from 'react';

const defaultProfile = {
  username: 'u/User',
  bio: 'This is my bio.',
  avatar: 'commenter1.jpg', // default avatar key matching imageMap
};

const ProfileContext = createContext({
  profile: defaultProfile,
  setProfile: () => {},
});

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
} 