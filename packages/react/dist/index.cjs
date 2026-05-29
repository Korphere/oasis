Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
react = __toESM(react);
let _korphere_oasis_core = require("@korphere/oasis-core");
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/index.tsx
const OasisContext = (0, react.createContext)(void 0);
const OasisProvider = ({ children }) => {
	const [osInfo, setOsInfo] = (0, react.useState)(null);
	const [isLoading, setIsLoading] = (0, react.useState)(true);
	(0, react.useEffect)(() => {
		let isMounted = true;
		(0, _korphere_oasis_core.getOSInfo)().then((info) => {
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
		return (0, _korphere_oasis_core.selectDownloadUrl)(osInfo, targets);
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OasisContext.Provider, {
		value: {
			osInfo,
			isLoading,
			getDownloadUrl
		},
		children
	});
};
const useOS = () => {
	const context = (0, react.useContext)(OasisContext);
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
exports.OasisProvider = OasisProvider;
exports.useOS = useOS;
