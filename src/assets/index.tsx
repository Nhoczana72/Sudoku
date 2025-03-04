import {fromPairs} from 'lodash';

const SOURCE = {
  LOGO: require('./iconSudoku.png'),
};

export const getSource = (source: keyof typeof SOURCE) => {
  return SOURCE[source];
};

export * from './svg';
