//#region src/index.d.ts
declare const OS: {
  readonly WINDOWS: "windows";
  readonly MACOS: "macos";
  readonly LINUX: "linux";
  readonly IOS: "ios";
  readonly ANDROID: "android";
  readonly UNKNOWN: "unknown";
};
type OS = typeof OS[keyof typeof OS];
interface OSInfo {
  name: OS;
  version: string;
  isArm: boolean;
  isMobile: boolean;
  is: (osName: OS) => boolean;
}
interface DownloadTargets {
  windows?: string;
  macos?: string;
  linux?: string;
  ios?: string;
  android?: string;
  fallback: string;
}
declare function getOSInfo(): Promise<OSInfo>;
declare function selectDownloadUrl(info: OSInfo, targets: DownloadTargets): string;
declare function autoLink(selector: string, targets: DownloadTargets, options?: {
  updateText?: boolean;
}): Promise<void>;
//#endregion
export { DownloadTargets, OS, OSInfo, autoLink, getOSInfo, selectDownloadUrl };