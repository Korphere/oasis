import { createContext, useContext, useEffect, useState } from "react";
import { getOSInfo, selectDownloadUrl } from "@korphere/oasis-core";
import { jsx } from "react/jsx-runtime";
//#region src/index.tsx
const OasisContext = createContext(void 0);
const OasisProvider = ({ children }) => {
	const [osInfo, setOsInfo] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		let isMounted = true;
		getOSInfo().then((info) => {
			if (isMounted) {
				setOsInfo(info);
				setIsLoading(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, []);
	const getDownloadUrl = (targets) => {
		if (isLoading || !osInfo) return targets.fallback;
		return selectDownloadUrl(osInfo, targets);
	};
	return /* @__PURE__ */ jsx(OasisContext.Provider, {
		value: {
			osInfo,
			isLoading,
			getDownloadUrl
		},
		children
	});
};
const useOS = () => {
	const context = useContext(OasisContext);
	if (!context) throw new Error("useOS must be used within an OasisProvider");
	return {
		os: context.osInfo?.name ?? "unknown",
		version: context.osInfo?.version ?? "unknown",
		isArm: context.osInfo?.isArm ?? false,
		isMobile: context.osInfo?.isMobile ?? false,
		is: (osName) => context.osInfo?.is(osName) ?? false,
		isLoading: context.isLoading,
		getDownloadUrl: context.getDownloadUrl
	};
};
//#endregion
export { OasisProvider, useOS };
