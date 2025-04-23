/* eslint-disable max-statements */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Pressable, Alert, FlatList} from 'react-native';
import {styles} from './PlayingGame.styles';
import {PlayingGameLogic} from './PlayingGame.logic';
import sudoku from 'sudoku-umd';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Time from 'react-native-background-timer';
import {fncSecondsToHMS} from '~core';
import lodash from 'lodash';
import {getSudoku} from 'sudoku-gen';
import {useSelector} from 'react-redux';
import {ScoreSelector} from '~modules/setting';
import store from '~core/store';
import settingStore from '~modules/setting/settingStore';

export const PlayingGame: React.FC<any> = props => {
  const {} = props;

  const [staArrSudoku, setStaArrSudoku] = useState<any>();
  const [staArrSudokuFill, setStaArrSudokuFill] = useState<any>();
  const [staArrSudokuFillNote, setStaArrSudokuFillNote] = useState<any>();
  const [staArrSudokuSolve, setStaArrSudokuSolve] = useState<any>();
  const {dispatch} = PlayingGameLogic();
  const [chooseIndex, setChooseIndex] = useState([0, 0]);
  const [chooseValue, setChooseValue] = useState(0);
  const [staFillMatrix, setStaFillMatrix] = useState([]);
  const [staMistakes, setMistakes] = useState(0);
  const TimeRef = useRef<any>();
  const [staTime, setStaTime] = useState(0);
  const [staPause, setStaPause] = useState(true);
  const [staHint, setStaHint] = useState(3);
  const [staNote, setStaNote] = useState(false);
  const {goBack} = useNavigation();
  const {params} = useRoute();
  const [staHistory, setStaHistory] = useState(0);
  const [staListHistory, setStaListHistory] = useState([]);

  //{col:number,row:number,isValid,id:col,row}
  const isFocus = useIsFocused();
  const {score} = useSelector(ScoreSelector);

  const _boolean = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const numberFil = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Erase'];
  useEffect(() => {
    NewsGame();
  }, [isFocus]);
  useEffect(() => {
    if (staPause === false) {
      TimeRef.current = Time.setInterval(() => {
        setStaTime(staTime + 1);
      }, 1000);
    } else {
      Time.clearInterval(TimeRef.current);
    }
    return () => {
      if (TimeRef.current) {
        Time.clearInterval(TimeRef.current);
        TimeRef.current = undefined;
      }
    };
  }, [staPause, staTime]);

  const NewsGame = () => {
    const __sudoku = getSudoku(params?.level);

    const a = sudoku.generate(params?.level, true);
    const generateArrSudoku = sudoku.board_string_to_grid(__sudoku.puzzle);
    const generateArrSudokuFill = sudoku.board_string_to_grid(__sudoku.puzzle);
    const generateArrSudokuSolve = sudoku.board_string_to_grid(
      __sudoku.solution,
    );
    // const generateArrSudoku = sudoku.board_string_to_grid(a);
    // const generateArrSudokuFill = sudoku.board_string_to_grid(a);
    // const generateArrSudokuSolve = sudoku.board_string_to_grid(sudoku.solve(a));

    setStaTime(0);
    setStaPause(false);
    setStaArrSudoku(generateArrSudoku);
    setStaArrSudokuFill(generateArrSudokuFill);
    setStaArrSudokuSolve(generateArrSudokuSolve);
    let i = 0;
    let j = 0;
    let _matrixNote = [];
    _matrixNote = [];

    for (i = 0; i < 9; i++) {
      _matrixNote[i] = [];
      // Lặp theo cột, số cộ từ 0 -> số lượng phần tử của hàng i
      for (j = 0; j < 9; j++) {
        _matrixNote[i][j] = [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ];
      }
    }

    setStaArrSudokuFillNote(_matrixNote);
    let _arrHistoRy = [];
    _arrHistoRy = lodash.cloneDeep(staListHistory);
    _arrHistoRy.push([generateArrSudokuFill, _matrixNote]);
    setStaListHistory(_arrHistoRy);
    console.log('score', score);

    let _score: any = {};
    _score = lodash.cloneDeep(score);
    _score[params?.level].totalGame = _score[params?.level].totalGame + 1;

    dispatch(settingStore.actions.setScore(_score));
  };
  useEffect(() => {
    if (
      staArrSudokuFill !== undefined &&
      staArrSudokuSolve !== undefined &&
      sudoku.board_grid_to_string(staArrSudokuFill) ===
        sudoku.board_grid_to_string(staArrSudokuSolve)
    ) {
      setStaPause(true);
      let _score: any = {};
      _score = lodash.cloneDeep(score);
      if (
        _score[params?.level].bestTime === 0 ||
        staTime < _score[params?.level].bestTime
      ) {
        _score[params?.level].bestTime = staTime;
      }
      _score[params?.level].gamesWon = _score[params?.level].gamesWon + 1;
      dispatch(settingStore.actions.setScore(_score));

      dispatch(settingStore.actions.setScore(_score));
      Alert.alert(
        '',
        `Thắng gòi đó má!!!\nThời gian hoàn thành:${
          fncSecondsToHMS(staTime).HmsString
        }`,
        [
          {text: 'Back', onPress: () => goBack()},
          {text: 'New game', onPress: () => NewsGame()},
        ],
      );
    }
  }, [staArrSudokuFill]);

  const onCheckNumber = useCallback(
    (indexRow: number, indexCol: number) => {
      if (
        staArrSudoku[indexRow][indexCol] === '-' &&
        staArrSudokuFill[indexRow][indexCol] ===
          staArrSudokuSolve[indexRow][indexCol]
      ) {
        return true;
      } else if (
        staArrSudokuFill[indexRow][indexCol] !==
        staArrSudokuSolve[indexRow][indexCol]
      ) {
        return false;
      } else {
        return undefined;
      }
    },
    [chooseIndex, staFillMatrix, staArrSudokuFill, staArrSudokuSolve],
  );
  const onFillNumber = useCallback(
    (number: number) => {
      if (staNote) {
        let _ArrNoteMatrix = [];
        setStaHistory(staHistory + 1);
        _ArrNoteMatrix = lodash.cloneDeep(staArrSudokuFillNote);
        const _arrHistoRy = lodash.cloneDeep(staListHistory);
        if (number === 'Erase') {
          _ArrNoteMatrix[chooseIndex[1]][chooseIndex[0]] = _boolean;
          _arrHistoRy.push([staArrSudokuFill, _ArrNoteMatrix]);
          setStaListHistory(_arrHistoRy);

          return setStaArrSudokuFillNote(_ArrNoteMatrix);
        }
        _ArrNoteMatrix[chooseIndex[1]][chooseIndex[0]][number - 1] =
          !_ArrNoteMatrix[chooseIndex[1]][chooseIndex[0]][number - 1];
        _arrHistoRy.push([staArrSudokuFill, _ArrNoteMatrix]);
        setStaListHistory(_arrHistoRy);

        return setStaArrSudokuFillNote(_ArrNoteMatrix);
      }
      let _ArrMatrix = [];
      _ArrMatrix = [...staArrSudokuFill];
      setStaHistory(staHistory + 1);
      let _arrHistoRy = [];
      _arrHistoRy = lodash.cloneDeep(staListHistory);

      if (
        staArrSudoku[chooseIndex[1]][chooseIndex[0]] === '-' ||
        onCheckNumber(chooseIndex[1], chooseIndex[0]) === false
      ) {
        if (
          number !== 'Erase' &&
          staArrSudokuSolve[chooseIndex[1]][chooseIndex[0]] !== number
        ) {
          setMistakes(staMistakes + 1);
          if (staMistakes + 1 >= 3) {
            Alert.alert('', 'Bạn đã thua rồi!!!!', [
              {
                text: 'Reset',
                onPress: () => {
                  setMistakes(0);

                  setStaArrSudokuFill(staArrSudoku);
                },
              },
              {
                text: 'New game',
                onPress: () => {
                  setMistakes(0);
                  NewsGame();
                },
              },
            ]);
          }
        }
        _ArrMatrix[chooseIndex[1]][chooseIndex[0]] =
          number === 'Erase' ? '-' : number;
        let i = 0;
        let _ArrNoteMatrix = [];
        _ArrNoteMatrix = lodash.cloneDeep(staArrSudokuFillNote);

        for (i = 0; i < 9; i++) {
          if (chooseIndex[0] !== i) {
            _ArrNoteMatrix[chooseIndex[1]][i][number - 1] = false;
          }
          if (chooseIndex[1] !== i) {
            _ArrNoteMatrix[i][chooseIndex[0]][number - 1] = false;
          }
        }
        _arrHistoRy.push([staArrSudokuFill, _ArrNoteMatrix]);
        setStaListHistory(_arrHistoRy);
        setStaArrSudokuFillNote(_ArrNoteMatrix);
        setStaArrSudokuFill(_ArrMatrix);
      }
    },
    [
      chooseIndex,
      staFillMatrix,
      staArrSudokuFill,
      staArrSudoku,
      staMistakes,
      staNote,
      staArrSudokuFillNote,
      staHistory,
      staListHistory,
    ],
  );
  const bgrColor = (indexRow: number, indexCol: number) => {
    let boolean1 = false;
    let boolean2 = false;

    if (chooseIndex[0] >= 6) {
      boolean1 = indexRow >= 6;
    } else if (chooseIndex[0] < 3) {
      boolean1 = indexRow < 3;
    } else {
      boolean1 = indexRow < 6 && indexRow >= 3;
    }

    if (chooseIndex[1] >= 6) {
      boolean2 = indexCol >= 6;
    } else if (chooseIndex[1] < 3) {
      boolean2 = indexCol < 3;
    } else {
      boolean2 = indexCol < 6 && indexCol >= 3;
    }
    if (boolean1 === true && boolean2 === true) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          width: wp(90),
          marginBottom: hp(5),
          marginTop: hp(2),
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => {
            goBack();
          }}>
          <AntDesign name="arrowleft" size={wp(5)} />
        </Pressable>
        <Pressable
          onPress={() => {
            // goBack();
            setStaPause(true);
            Alert.alert('', 'Resume', [
              {
                text: 'Resume',
                onPress: () => {
                  setStaPause(false);
                },
              },
            ]);
          }}>
          <AntDesign name="pause" size={wp(5)} />
        </Pressable>
        <Pressable
        // onPress={() => {
        //   goBack();
        // }}
        >
          {/* <AntDesign name="arrowleft" size={wp(5)} /> */}
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-around',
        }}>
        <Text style={{textTransform: 'capitalize'}}>Level:{params?.level}</Text>
        <Text>Mistakes:{staMistakes}/3</Text>
        <Text>Time:{fncSecondsToHMS(staTime).HmsString}</Text>
      </View>
      {staArrSudokuFill?.map((valueRow: any, indexCol: number) => {
        return (
          <View style={{flexDirection: 'row'}}>
            {valueRow.map((value: any, indexRow: number) => {
              return (
                <Pressable
                  onPress={() => {
                    setChooseIndex([indexRow, indexCol]);
                    setChooseValue(value !== '-' ? value : 0);
                  }}
                  style={{
                    // borderWidth: 1,
                    borderTopWidth:
                      indexCol === 0 || indexCol === 3 || indexCol === 6
                        ? wp(0.5)
                        : wp(0.1),
                    borderLeftWidth:
                      indexRow === 0 || indexRow === 3 || indexRow === 6
                        ? wp(0.5)
                        : wp(0.1),
                    borderBottomWidth: indexCol === 8 ? wp(0.4) : wp(0.1),
                    borderRightWidth: indexRow === 8 ? wp(0.4) : wp(0.1),
                    backgroundColor:
                      indexRow === chooseIndex[0] && indexCol === chooseIndex[1]
                        ? '#bbdefb'
                        : value === chooseValue
                        ? '#c3d7ea'
                        : indexRow === chooseIndex[0] ||
                          indexCol === chooseIndex[1]
                        ? '#e2ebf3'
                        : bgrColor(indexRow, indexCol)
                        ? '#e2ebf3'
                        : 'white',
                    width: wp(10),
                    height: wp(10),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {staArrSudokuFill[indexCol][indexRow] === '-' ? (
                    <FlatList
                      data={staArrSudokuFillNote[indexCol][indexRow]}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={3}
                      contentContainerStyle={{
                        justifyContent: 'space-around',
                        alignContent: 'space-around',
                        height: '100%',
                        width: '90%',
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <Text
                            style={{
                              fontSize: wp(2),
                              marginHorizontal: wp(1),
                              color: 'grey',
                            }}>
                            {item === true ? index + 1 : '  '}
                          </Text>
                        );
                      }}
                    />
                  ) : (
                    // <View
                    //   style={
                    //     {
                    //       // flexDirection: 'row',
                    //       // flexWrap: 'wrap',
                    //       // justifyContent: 'center',
                    //     }
                    //   }>
                    //   {numberAbc.map((item: any, index: any) => {
                    //     return (
                    //       <Text
                    //         style={{fontSize: wp(2), marginHorizontal: wp(1)}}>
                    //         {item}
                    //       </Text>
                    //     );
                    //   })}
                    // </View>
                    <Text
                      style={{
                        fontSize: wp(7),
                        fontWeight: '300',
                        color:
                          onCheckNumber(indexCol, indexRow) === false
                            ? 'red'
                            : staArrSudoku[indexCol][indexRow] === '-'
                            ? 'blue'
                            : 'black',
                      }}>
                      {value !== '-' ? value : ''}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        );
      })}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: wp(90),
          marginTop: hp(2),
        }}>
        <View style={{alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              if (staHistory > 0) {
                setStaHistory(staHistory - 1);
                setStaArrSudokuFill(staListHistory[staHistory - 1][0]);
                setStaArrSudokuFillNote(staListHistory[staHistory - 1][1]);
              }
            }}
            style={{
              backgroundColor: '#EAEEF4',
              width: wp(15),
              height: wp(15),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: wp(10),
            }}>
            <EvilIcons name={'undo'} size={wp(10)} />
          </Pressable>
          <Text>Undo</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              if (staHistory < staListHistory.length - 1) {
                setStaHistory(staHistory + 1);
                setStaArrSudokuFill(staListHistory[staHistory + 1][0]);
                setStaArrSudokuFillNote(staListHistory[staHistory + 1][1]);
              }
            }}
            style={{
              backgroundColor: '#EAEEF4',
              width: wp(15),
              height: wp(15),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: wp(10),
            }}>
            <EvilIcons name={'redo'} size={wp(8)} />
          </Pressable>
          <Text>Redo</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              setStaNote(!staNote);
            }}
            style={{
              backgroundColor: '#EAEEF4',
              width: wp(15),
              height: wp(15),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: wp(10),
              flexDirection: 'row',
              borderWidth: staNote ? 2 : 0,
              borderColor: '#3259AF',
            }}>
            <EvilIcons name={'pencil'} size={wp(8)} />
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: -10,
                backgroundColor: '#3259AF',
                padding: 5,
                borderRadius: wp(10),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: wp(3),
                }}>
                {staNote === false ? 'Off' : 'On'}
              </Text>
            </View>
          </Pressable>
          <Text>Note</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              if (
                staHint > 0 &&
                staArrSudokuFill[chooseIndex[1]][chooseIndex[0]] === '-'
              ) {
                setStaHint(staHint - 1);
                const _a = [...staArrSudokuFill];
                _a[chooseIndex[1]][chooseIndex[0]] =
                  staArrSudokuSolve[chooseIndex[1]][chooseIndex[0]];
              }
            }}
            style={{
              backgroundColor: '#EAEEF4',
              width: wp(15),
              height: wp(15),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: wp(10),
            }}>
            <EvilIcons name={'star'} size={wp(8)} />
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: -10,
                backgroundColor: '#3259AF',
                borderRadius: wp(10),
                width: wp(6),
                height: wp(6),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: wp(3),
                  alignSelf: 'center',
                }}>
                {staHint}
              </Text>
            </View>
          </Pressable>
          <Text>Hint</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {numberFil.map(item => {
          return (
            <Pressable
              onPress={() => {
                onFillNumber(item);
                setChooseValue(item);
              }}
              style={{
                width: wp(15),
                height: wp(15),
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp(3),
                marginHorizontal: wp(2),
                borderWidth: 0.5,
                borderRadius: wp(2),
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: item !== 'Erase' ? wp(10) : wp(3),
                }}>
                {item}
              </Text>
              <Text style={{position: 'absolute', top: 5, right: 5}}>
                {item !== 'Erase' && staArrSudokuFill !== undefined
                  ? 9 -
                    (sudoku.board_grid_to_string(staArrSudokuFill).split(item)
                      .length -
                      1)
                  : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
