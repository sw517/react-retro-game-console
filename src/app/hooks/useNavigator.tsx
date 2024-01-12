export default function useNavigator() {
  const vibrate = (length: number = 10) => {
    try {
      console.log('bzz');
      window.navigator.vibrate(length);
    } catch (error) {}
  };

  return { vibrate };
}
