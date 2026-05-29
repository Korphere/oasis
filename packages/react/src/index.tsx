import React, { createContext, useContext, useEffect, useState } from 'react';
import { getOSInfo, selectDownloadUrl, type OSInfo, type DownloadTargets } from '@korphere/oasis-core';

interface OasisContextType {
  osInfo: OSInfo | null;
  isLoading: boolean;
  getDownloadUrl: (targets: DownloadTargets) => string;
}

const OasisContext = createContext<OasisContextType | undefined>(undefined);

export const OasisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [osInfo, setOsInfo] = useState<OSInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getOSInfo().then((info: OSInfo) => {
      if (isMounted) {
        setOsInfo(info);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getDownloadUrl = (targets: DownloadTargets): string => {
    if (isLoading || !osInfo) return targets.fallback;
    return selectDownloadUrl(osInfo, targets);
  };

  return (
    <OasisContext.Provider value={{ osInfo, isLoading, getDownloadUrl }}>
      {children}
    </OasisContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OasisContext);
  if (!context) {
    throw new Error('useOS must be used within an OasisProvider');
  }

  return {
    os: context.osInfo?.name ?? 'unknown',
    version: context.osInfo?.version ?? 'unknown',
    isArm: context.osInfo?.isArm ?? false,
    isMobile: context.osInfo?.isMobile ?? false,
    is: (osName: Parameters<OSInfo['is']>[0]) => context.osInfo?.is(osName) ?? false,
    isLoading: context.isLoading,
    getDownloadUrl: context.getDownloadUrl,
  };
};