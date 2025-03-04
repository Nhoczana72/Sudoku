export function elevationShadowStyle(elevation: number) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}

export function fncSecondsToHMS(seconds: number | any) {
  if (seconds === null || seconds === undefined) {
    return {
      h: '00',
      m: '00',
      s: '00',
      HmsString: `null`,
    };
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 3600) % 60;
  const SecondsToHMS = {
    h: h,
    m: m,
    s: s,
    HmsString: `${h > 0 ? (h < 10 ? `0${h}:` : 'h:') : ''}${
      m < 10 ? `0${m}` : m
    }:${s < 10 ? `0${s}` : s}`,
  };
  //h: hour m:minutes s:seconds
  return SecondsToHMS;
}
export function fncHMSToSeconds(HMS: string | undefined) {
  if (HMS === undefined) {
    return 0;
  }
  const result = HMS.replace(/:/g, '');

  const h = result.slice(0, 2) === '00' ? 0 : result.slice(0, 2);
  const m = result.slice(2, 4) === '00' ? 0 : result.slice(2, 4);
  const s = result.slice(4) === '00' ? 0 : Number(result.slice(4));

  const ss = h * 60 * 60 + m * 60 + s;

  return ss;
}
