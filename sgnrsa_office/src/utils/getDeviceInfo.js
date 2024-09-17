export default function getDeviceInfo() {
          return {
                    userAgent: navigator.userAgent,
                    vendor: navigator.vendor,
                    platform: navigator.platform,
                    appCodeName: navigator.appCodeName,
                    appName: navigator.appName,
                    appVersion: navigator.appVersion,
                    browserName: getBrowserInfo().name,
                    browserVersion: getBrowserInfo().version,
                    osName: navigator.userAgentData?.platform || navigator.platform,
                    osVersion: getOsVersion(),
                    mobile: navigator.userAgentData?.mobile
          }
}

function getBrowserInfo() {
          const userAgent = navigator.userAgent
          const browsers = {
                    Chrome: /Chrome/i,
                    Firefox: /Firefox/i,
                    Safari: /Safari/i,
                    Edge: /Edg/i,
                    IE: /MSIE|Trident/i,
          };
          for (const browser in browsers) {
                    if (browsers[browser].test(userAgent)) {
                              const versionRegex = new RegExp(`${browser}(?:/| )([\\d.]+)`);
                              const versionMatch = userAgent.match(versionRegex);
                              const version = versionMatch ? versionMatch[1] : null
                              return {
                                        name: getBrowserType(),
                                        version: version,
                              };
                    }
          }
          return {
                    name: null,
                    version: null,
          };
}

const getOsVersion = () => {
          const userAgent = navigator.userAgent
          if (userAgent.includes("Win")) {
                    // Windows OS
                    if (userAgent.includes("Windows NT 10.0")) {
                              return "Windows 10";
                    } else if (userAgent.includes("Windows NT 6.3")) {
                              return "Windows 8.1";
                    } else if (userAgent.includes("Windows NT 6.2")) {
                              return "Windows 8";
                    } else if (userAgent.includes("Windows NT 6.1")) {
                              return "Windows 7";
                    } else {
                              return "Windows (Unknown Version)";
                    }
          } else if (userAgent.includes("Ubuntu")) {
                    // Ubuntu
                    return "Ubuntu";
          } else if (userAgent.includes("Linux")) {
                    // Other Linux
                    return "Linux (Unknown Distribution)";
          } else if (userAgent.includes("Mac")) {
                    // macOS
                    return "macOS";
          } else {
                    // Other or Unknown OS
                    return null
          }
}

function getBrowserType() {
          const test = regexp => {
                    return regexp.test(navigator.userAgent);
          };

          if (test(/opr\//i) || !!window.opr) {
                    return 'Opera';
          } else if (test(/edg/i)) {
                    return 'Microsoft Edge';
          } else if (test(/chrome|chromium|crios/i)) {
                    return 'Google Chrome';
          } else if (test(/firefox|fxios/i)) {
                    return 'Mozilla Firefox';
          } else if (test(/safari/i)) {
                    return 'Apple Safari';
          } else if (test(/trident/i)) {
                    return 'Microsoft Internet Explorer';
          } else if (test(/ucbrowser/i)) {
                    return 'UC Browser';
          } else if (test(/samsungbrowser/i)) {
                    return 'Samsung Browser';
          } else {
                    return 'Unknown browser';
          }
}