import { StyleSheet } from 'react-native';

import { Spinner } from './Spinner';

export function FullPageSpinner() {
  return <Spinner style={styles.fullPage} />;
}

const styles = StyleSheet.create({
  fullPage: {
    flex: 1,
  },
});
