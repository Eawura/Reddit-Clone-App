import { Stack } from 'expo-router';

const onlayout = () => {
  // const [loaded] = useFonts({
  //   MontserratItalic:require("../assets/fonts/Montserrat-Italic-VariableFont_wght.tff"),
  //   Montserrat:require("../assets/fonts/Montserrat-VariableFont_wght.tff"),
  // })

  // useEffect(()=>{
  //   if(loaded){
  //     SplashScreen.hideAsync()
  //   }
  // },[loaded])

  // if(!loaded){
  //   return null;
  // }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default onlayout;