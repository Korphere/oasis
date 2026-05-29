import React from "react";
import { DownloadTargets, OSInfo } from "@korphere/oasis-core";

//#region src/index.d.ts
declare const OasisProvider: React.FC<{
  children: React.ReactNode;
}>;
declare const useOS: () => {
  os: import("@korphere/oasis-core").OS;
  version: string;
  isArm: boolean;
  isMobile: boolean;
  is: (osName: Parameters<OSInfo["is"]>[0]) => boolean;
  isLoading: boolean;
  getDownloadUrl: (targets: DownloadTargets) => string;
};
//#endregion
export { OasisProvider, useOS };