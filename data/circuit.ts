import {
  abudhabi,
  Bahrain,
  barcelona,
  brazil,
  canada,
  china,
  england,
  france,
  hungary,
  italy,
  japan,
  mexico,
  netherlands,
  red_bull_ring,
  texas,
} from "./raceData/raceData";
import {
  americas,
  bahrain,
  catalunya,
  hungaroring,
  interlagos,
  monza,
  rodriguez,
  shanghai,
  silverstone,
  spa,
  spielberg,
  suzuka,
  villeneuve,
  yas_marina,
  zandvoort,
} from "./trackData/trackData";

export const circuits: { [key: string]: { track: any[]; top3: any[] } } = {
  hungaroring: {
    track: hungaroring,
    top3: hungary,
  },
  suzuka: {
    track: suzuka,
    top3: japan,
  },
  zandvoort: {
    track: zandvoort,
    top3: netherlands,
  },
  spa: {
    track: spa,
    top3: france,
  },
  silverstone: {
    track: silverstone,
    top3: england,
  },
  shanghai: {
    track: shanghai,
    top3: china,
  },
  interlagos: {
    track: interlagos,
    top3: brazil,
  },
  bahrain: {
    track: bahrain,
    top3: Bahrain,
  },
  monza: {
    track: monza,
    top3: italy,
  },
  villeneuve: {
    track: villeneuve,
    top3: canada,
  },
  rodriguez: {
    track: rodriguez,
    top3: mexico,
  },
  catalunya: {
    track: catalunya,
    top3: barcelona,
  },
  yas_marina: {
    track: yas_marina,
    top3: abudhabi,
  },
  americas: {
    track: americas,
    top3: texas,
  },
  red_bull_ring: {
    track: spielberg,
    top3: red_bull_ring,
  },
};
