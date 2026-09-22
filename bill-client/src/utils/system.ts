export const checkSystemInfo = () => {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return {
    isMobile: isAndroid || isIOS,
    isAndroid,
    isIOS,
  };
};
