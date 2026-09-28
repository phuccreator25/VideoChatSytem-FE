export function parseDeviceDetails(userAgent: string) {
    const ua = userAgent.toLowerCase();

    // Detect OS
    let osName = "Unknown OS";
    let osType: "windows" | "mac" | "ios" | "android" | "linux" = "windows";

    if (ua.includes("win")) {
        osName = "Windows";
        osType = "windows";
    } else if (ua.includes("macintosh") || ua.includes("mac os")) {
        osName = "macOS";
        osType = "mac";
    } else if (ua.includes("iphone") || ua.includes("ipad")) {
        osName = "iOS";
        osType = "ios";
    } else if (ua.includes("android")) {
        osName = "Android";
        osType = "android";
    } else if (ua.includes("linux")) {
        osName = "Linux";
        osType = "linux";
    }

    // Detect Browser
    let browserName = "Web Browser";
    if (ua.includes("edg/")) {
        browserName = "Microsoft Edge";
    } else if (ua.includes("chrome") && !ua.includes("edg/")) {
        browserName = "Google Chrome";
    } else if (ua.includes("firefox")) {
        browserName = "Mozilla Firefox";
    } else if (ua.includes("safari") && !ua.includes("chrome")) {
        browserName = "Apple Safari";
    } else if (ua.includes("opera") || ua.includes("opr/")) {
        browserName = "Opera";
    }

    return { osName, browserName, osType };
}