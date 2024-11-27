import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import React, {useMemo, useState, useEffect, useContext, useCallback, createContext } from "react";

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  // Load avatar URL from the cookie on initial render
  useEffect(() => {
    const storedAvatarUrl = JSON.parse(Cookies.get("userObj")).avatar;
    if (storedAvatarUrl) {
      setAvatarUrl(addCacheBuster(storedAvatarUrl));
    }
  }, []);

  const addCacheBuster = (url) => `${url}?t=${Date.now()}`;

  const updateAvatarUrl = useCallback((newAvatarUrl) => {
    setAvatarUrl(addCacheBuster(newAvatarUrl)); // Update with cache-busting
  }, []);


  const avatarValue = useMemo(() => ({
    avatarUrl, updateAvatarUrl
  }), [avatarUrl, updateAvatarUrl]);
  
  return (
    <AvatarContext.Provider value={avatarValue}>
      {children}
    </AvatarContext.Provider>
  );
};

AvatarProvider.propTypes = {
    children: PropTypes.node,
};

export const useAvatar = () => useContext(AvatarContext);
