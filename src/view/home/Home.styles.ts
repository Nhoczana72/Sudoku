import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: hp(100),
    width: wp(100),
    backgroundColor: 'white',
  },
  tx_header: {
    color: '#008080',
    fontSize: wp(9),
  },
  tx_headerRed: {
    color: 'red',
    fontSize: wp(9),
  },
  tx_headerOrange: {
    color: 'orange',
    fontSize: wp(9),
  },
  tx_headerYellow: {
    color: 'yellow',
    fontSize: wp(9),
  },
  tx_headerGreen: {
    color: 'green',
    fontSize: wp(9),
  },
  tx_headerBlue: {
    color: 'blue',
    fontSize: wp(9),
  },
  btn_chooseLevelScore: {
    // borderBottomWidth: 2,
    borderBottomColor: '#008080',
    width: '25%',
    alignItems: 'center',
    marginTop: hp(1),
  },
  view_row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },
  tx_score: {
    fontWeight: '600',
  },
});
