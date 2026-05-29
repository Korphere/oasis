Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/index.ts
function detectFromUA(ua) {
	let name = "unknown";
	const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);
	if (/windows/i.test(ua)) name = "windows";
	else if (/macintosh|mac os x/i.test(ua)) name = "macos";
	else if (/android/i.test(ua)) name = "android";
	else if (/iphone|ipad|ipod/i.test(ua)) name = "ios";
	else if (/linux/i.test(ua)) name = "linux";
	let version = "unknown";
	if (name === "windows") {
		const match = ua.match(/Windows NT ([\d.]+)/);
		version = match ? match[1] : "unknown";
	}
	const isArm = /arm|aarch64|applewebkit/i.test(ua) && name === "macos";
	return {
		name,
		version,
		isArm,
		isMobile
	};
}
async function getOSInfo() {
	const createInfo = (data) => ({
		...data,
		is: (osName) => data.name === osName
	});
	if (typeof window === "undefined" || !window.navigator) return createInfo({
		name: "unknown",
		version: "unknown",
		isArm: false,
		isMobile: false
	});
	const nav = window.navigator;
	if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === "function") try {
		const hints = await nav.userAgentData.getHighEntropyValues(["platformVersion", "architecture"]);
		const platform = nav.userAgentData.platform.toLowerCase();
		let name = "unknown";
		if (platform.includes("windows")) name = "windows";
		else if (platform.includes("macos")) name = "macos";
		else if (platform.includes("android")) name = "android";
		else if (platform.includes("ios")) name = "ios";
		else if (platform.includes("linux")) name = "linux";
		let version = hints.platformVersion || "unknown";
		if (name === "windows" && version !== "unknown") version = parseInt(version.split(".")[0], 10) >= 13 ? "11" : "10";
		const isArm = hints.architecture === "arm" || hints.architecture === "arm64" || platform === "macos";
		return createInfo({
			name,
			version,
			isArm,
			isMobile: nav.userAgentData.mobile
		});
	} catch (e) {}
	return createInfo(detectFromUA(nav.userAgent));
}
function selectDownloadUrl(info, targets) {
	if (info.name === "unknown") return targets.fallback;
	return targets[info.name] || targets.fallback;
}
async function autoLink(selector, targets, options) {
	if (typeof window === "undefined") return;
	const elements = document.querySelectorAll(selector);
	elements.forEach((el) => {
		if (el.tagName === "A") el.setAttribute("href", targets.fallback);
	});
	const info = await getOSInfo();
	const finalUrl = selectDownloadUrl(info, targets);
	elements.forEach((el) => {
		if (el.tagName === "A") el.setAttribute("href", finalUrl);
		if (options?.updateText && info.name !== "unknown") el.textContent = `Download ${{
			windows: "Windows",
			macos: "macOS",
			linux: "Linux",
			ios: "iOS",
			android: "Android",
			unknown: ""
		}[info.name]} edition`;
	});
}
//#endregion
exports.autoLink = autoLink;
exports.getOSInfo = getOSInfo;
exports.selectDownloadUrl = selectDownloadUrl;
