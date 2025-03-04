import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {styles} from './Home.styles';
import {HomeLogic} from './Home.logic';
import * as Animatable from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Font} from '~assets/fonts';
import {navigate} from '~core/helper/navigate';
import {getSource} from '~assets';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Modal} from '~components';
import {fncSecondsToHMS} from '~core';
import {useSelector} from 'react-redux';
import {ScoreSelector} from '~modules/setting';

export const Home: React.FC<any> = props => {
  const {} = props;
  const {} = HomeLogic();
  const [staChooseLevel, setStaChooseLevel] = useState(false);
  const [staChooseScore, setStaChooseScore] = useState(false);
  const [staChooseLevelScore, setStaChooseLevelScore] = useState('easy');
  const {score} = useSelector(ScoreSelector);
  const zoomOut: Animatable.CustomAnimation = {
    0: {
      opacity: 1,
      marginTop: hp(40),
    },
    1: {
      opacity: 1,
      marginTop: hp(5),
    },
  };
  const down: Animatable.CustomAnimation = {
    0: {
      opacity: 1,
      marginTop: hp(40),
    },
    1: {
      opacity: 1,
      marginTop: 0,
    },
  };
  const level = ['easy', 'medium', 'hard', 'expert'];
  return (
    <View style={styles.container}>
      <View style={{width: wp(90)}}>
        {staChooseLevel && (
          <TouchableOpacity
            onPress={() => {
              setStaChooseLevel(false);
            }}>
            <AntDesign name="arrowleft" size={wp(5)} />
          </TouchableOpacity>
        )}
      </View>

      <Animatable.Text
        animation={zoomOut}
        duration={3000}
        style={styles.tx_header}>
        Sudoku
      </Animatable.Text>
      <Image
        source={getSource('LOGO')}
        style={{width: wp(30), height: wp(30)}}
      />
      <View style={{height: '50%', marginTop: hp(5)}}>
        {staChooseLevel === false && (
          <Animatable.View animation={zoomOut}>
            <TouchableOpacity
              onPress={() => {
                setStaChooseLevel(true);
              }}
              style={{
                backgroundColor: '#008080',
                width: wp(50),
                paddingVertical: hp(1.5),
                paddingHorizontal: wp(2),
                borderRadius: wp(2),
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: wp(6)}}>New Game</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        {staChooseLevel ? (
          <View>
            {level.map((item: any) => {
              return (
                <Animatable.View animation={down} duration={1500}>
                  <TouchableOpacity
                    onPress={() => {
                      navigate('PlayingGame', {level: item});
                    }}
                    style={{
                      backgroundColor: '#008080',
                      width: wp(50),
                      paddingVertical: hp(1.5),
                      paddingHorizontal: wp(2),
                      borderRadius: wp(2),
                      alignItems: 'center',
                      marginVertical: hp(1),
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: wp(6),
                        textTransform: 'capitalize',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </View>
        ) : (
          <Animatable.View animation={zoomOut}>
            <TouchableOpacity
              onPress={() => {
                setStaChooseScore(true);
              }}
              style={{
                backgroundColor: '#008080',
                width: wp(50),
                paddingVertical: hp(1.5),
                paddingHorizontal: wp(2),
                borderRadius: wp(2),
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: wp(6)}}>Score</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>
      <Modal isOpen={staChooseScore} position="center">
        <View
          style={{
            width: wp(95),
            // height: hp(35),
            backgroundColor: 'white',
            borderRadius: wp(1),
          }}>
          <View style={{backgroundColor: '#008080', width: '100%'}}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: wp(6),
                marginVertical: hp(1),
                fontWeight: '600',
              }}>
              Score
            </Text>
            <TouchableOpacity
              onPress={() => {
                setStaChooseScore(false);
              }}
              style={{
                position: 'absolute',
                right: -wp(3),
                top: -wp(3),
                width: wp(8),
                height: wp(8),
                backgroundColor: '#CC0000',
                borderRadius: wp(8),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: '800',
                  fontSize: wp(5),
                }}>
                X
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            {level.map((item: any) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.btn_chooseLevelScore,
                    staChooseLevelScore === item ? {borderBottomWidth: 2} : {},
                  ]}
                  onPress={() => {
                    setStaChooseLevelScore(item);
                  }}>
                  <Text style={{textTransform: 'capitalize'}}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.view_row}>
            <Text style={styles.tx_score}>Games Won</Text>
            <Text>{score[staChooseLevelScore]?.gamesWon}</Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.tx_score}>Total Games</Text>
            <Text>{score[staChooseLevelScore]?.totalGame}</Text>
          </View>

          <View style={styles.view_row}>
            <Text style={styles.tx_score}>Win</Text>
            <Text>
              {score[staChooseLevelScore]?.totalGame === 0
                ? 0
                : Math.round(
                    (score[staChooseLevelScore]?.gamesWon /
                      score[staChooseLevelScore]?.totalGame) *
                      100,
                  )}
              %
            </Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.tx_score}>Best</Text>
            <Text>
              {fncSecondsToHMS(score[staChooseLevelScore]?.bestTime).HmsString}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
