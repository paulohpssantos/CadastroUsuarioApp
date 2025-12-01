import { StyleSheet } from 'react-native';
import colors from './colors';

const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  // Headers
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    marginBottom: 10,
  },
  // Forms
  formContainer: {
    width: '100%',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  // Buttons
  primaryButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 2,
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  radiusButton: {
    alignSelf: 'flex-start',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 2,
    marginBottom: 12,
    backgroundColor: colors.primary,
    width: '100%',
  },
  
  
  
  
  
  
  
  
  
  
  
  
   

});

export default globalStyles;
