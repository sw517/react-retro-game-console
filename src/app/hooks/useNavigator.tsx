export default function useNavigator() {
  const vibrate = (length: number = 10) => {
    try {
      window.navigator.vibrate(length);
    } catch (error) {}
  };

  return { vibrate };
}
