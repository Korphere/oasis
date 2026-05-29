const OS = {
    WINDOWS: 'windows',
    MACOS: 'macos',
    LINUX: 'linux',
    IOS: 'ios',
    ANDROID: 'android',
    UNKNOWN: 'unknown',
} as const;

export type OS = typeof OS[keyof typeof OS];

export interface OSInfo {
  name: OS;
  version: string;
  isArm: boolean;
  isMobile: boolean;
  is: (osName: OS) => boolean;
}

export interface DownloadTargets {
  windows?: string;
  macos?: string;
  linux?: string;
  ios?: string;
  android?: string;
  fallback: string;
}

function detectFromUA(ua: string): Omit<OSInfo, 'is'> {
  let name: OS = 'unknown';
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);
  
  if (/windows/i.test(ua)) name = 'windows';
  else if (/macintosh|mac os x/i.test(ua)) name = 'macos';
  else if (/android/i.test(ua)) name = 'android';
  else if (/iphone|ipad|ipod/i.test(ua)) name = 'ios';
  else if (/linux/i.test(ua)) name = 'linux';

  let version = 'unknown';
  if (name === 'windows') {
    const match = ua.match(/Windows NT ([\d.]+)/);
    version = match ? match[1] : 'unknown';
  }

  const isArm = /arm|aarch64|applewebkit/i.test(ua) && name === 'macos';

  return { name, version, isArm, isMobile };
}

export async function getOSInfo(): Promise<OSInfo> {
  const createInfo = (data: Omit<OSInfo, 'is'>): OSInfo => ({
    ...data,
    is: (osName: OS) => data.name === osName,
  });

  if (typeof window === 'undefined' || !window.navigator) {
    return createInfo({ name: 'unknown', version: 'unknown', isArm: false, isMobile: false });
  }

  const nav = window.navigator as any;

  if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === 'function') {
    try {
      const hints = await nav.userAgentData.getHighEntropyValues(['platformVersion', 'architecture']);
      const platform = nav.userAgentData.platform.toLowerCase();
      let name: OS = 'unknown';

      if (platform.includes('windows')) name = 'windows';
      else if (platform.includes('macos')) name = 'macos';
      else if (platform.includes('android')) name = 'android';
      else if (platform.includes('ios')) name = 'ios';
      else if (platform.includes('linux')) name = 'linux';

      let version = hints.platformVersion || 'unknown';
      if (name === 'windows' && version !== 'unknown') {
        const majorVersion = parseInt(version.split('.')[0], 10);
        version = majorVersion >= 13 ? '11' : '10';
      }

      const isArm = hints.architecture === 'arm' || hints.architecture === 'arm64' || platform === 'macos';

      return createInfo({ name, version, isArm, isMobile: nav.userAgentData.mobile });
    } catch (e) {
    }
  }

  return createInfo(detectFromUA(nav.userAgent));
}

export function selectDownloadUrl(info: OSInfo, targets: DownloadTargets): string {
  if (info.name === 'unknown') {
    return targets.fallback;
  }
  return targets[info.name] || targets.fallback;
}

export async function autoLink(
  selector: string, 
  targets: DownloadTargets, 
  options?: { updateText?: boolean }
) {
  if (typeof window === 'undefined') return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el.tagName === 'A') el.setAttribute('href', targets.fallback);
  });

  const info = await getOSInfo();
  const finalUrl = selectDownloadUrl(info, targets);

  elements.forEach(el => {
    if (el.tagName === 'A') {
      el.setAttribute('href', finalUrl);
    }
    
    if (options?.updateText && info.name !== 'unknown') {
      const osLabels: Record<OS, string> = {
        windows: 'Windows',
        macos: 'macOS',
        linux: 'Linux',
        ios: 'iOS',
        android: 'Android',
        unknown: ''
      };
      el.textContent = `Download ${osLabels[info.name]} edition`;
    }
  });
}