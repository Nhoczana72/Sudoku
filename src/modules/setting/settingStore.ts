import {
  createAction,
  createSlice,
  PayloadAction,
  Selector,
} from '@reduxjs/toolkit';
import {RootState} from '~modules';
interface IStore {
  language: string;
  mode: string;
  splashLoad: boolean;
  mqttConnected: boolean;
  score: IScoreList;
}
interface IScoreList {
  easy: IScore;
  medium: IScore;
  hard: IScore;
  expert: IScore;
}
interface IScore {
  gamesWon: number;
  totalGame: number;
  bestTime: number;
}
export const setMqttConnected = createAction<any>('setting/setConnected');

const settingStore = createSlice({
  name: 'settingStore',
  initialState: {
    language: 'en',
    mode: 'production',
    splashLoad: false,
    mqttConnected: false,
    score: {
      easy: {bestTime: 0, totalGame: 0, gamesWon: 0},
      medium: {bestTime: 0, totalGame: 0, gamesWon: 0},
      hard: {bestTime: 0, totalGame: 0, gamesWon: 0},
      expert: {bestTime: 0, totalGame: 0, gamesWon: 0},
    },
  } as IStore,
  reducers: {
    updateLanguage: (state, action: PayloadAction<string>) =>
      Object.assign(state, {language: action.payload}),
    setSplash: (state, action: PayloadAction) => {
      return {
        ...state,
        splashLoad: true,
      };
    },
    setMode: (state, action: PayloadAction<string>) =>
      Object.assign(state, {mode: action.payload}),
    setMqttConnected: (state, action: any) =>
      Object.assign(state, {mqttConnected: action.payload}),
    setScore: (state, action: any) =>
      Object.assign(state, {score: action.payload}),
  },
  extraReducers: builder => {
    builder.addCase(setMqttConnected, (state: any, action) => {
      return {
        ...state,
        mqttConnected: action?.payload,
      };
    });
  },
});

interface ILang {
  language: string;
}
export const LanguageSelector: Selector<RootState, ILang> = state => {
  return {
    language: state.settingStore.language,
  };
};
interface ICodePush {
  mode: string;
  splash: boolean;
}
export const CodePushSelector: Selector<RootState, ICodePush> = state => {
  return {
    mode: state.settingStore.mode,
    splash: state.settingStore.splashLoad,
  };
};
interface IMqtt {
  mqttConnected: boolean;
}
export const MqttSelector: Selector<RootState, IMqtt> = state => {
  return {
    mqttConnected: state.settingStore.mqttConnected,
  };
};

export const ScoreSelector: Selector<RootState, any> = state => {
  return {
    score: state.settingStore.score,
  };
};

export default settingStore;
