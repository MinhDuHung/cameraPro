import { Alert, Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { PermissionsAndroid } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import storage from '@react-native-firebase/storage';
import Video from 'react-native-video';
const App = () => {
  const [img, setImg] = useState('')
  const [isloading, setIsloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)
  async function handlePost() {
    const uploadUri = img
    const fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
    setIsloading(true)
    try {
      const reference = await storage().ref(fileName).putFile(uploadUri);
      setIsloading(false)
      Alert.alert('Upload OK')
    } catch (error) {
      console.log(error)
    }
  }

  async function handleOpenCamera() {
    let options: any = {
      mediaType: 'video',
      saveToPhotos: true
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(options)
      const img: any = result.assets
      setImg(img[0].uri)
    }
    else {
      console.log(granted)
    }
  }

  async function handleOpenGallery() {
    let options: any = {
      mediaType: 'video',
      type: 'library',
      includeBase64: true,
    }
    launchImageLibrary(options, respone => {
      if (respone.didCancel) {
        console.log('User cancelled image picker')
      }
      else if (respone.errorCode) {
        console.log(respone.errorCode)
      }
      else {
        const img: any = respone.assets
        setImg(img[0].uri)
      }
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 6, }}>
        {
          img ?
            <LinearGradient
              colors={['#0878', '#0707']}
            //style={styles.linearGradient}
            >
              <TouchableOpacity
                onPress={() => setPaused(pre => !pre)}>
                <Video source={{ uri: img }}
                  paused={paused}
                  ref={ref}
                  onProgress={(pro) => {
                    setProgress(pro.currentTime)
                    console.log(pro)
                  }}
                  style={{ width: 350, aspectRatio: 1, }}
                  resizeMode='contain' />
              </TouchableOpacity>

              {/* <Image source={{ uri: img }} style={{ width: 350, aspectRatio: 1, resizeMode: 'contain' }} /> */}
            </LinearGradient>
            :
            <View><Text>Choose your img</Text></View>
        }
      </View>

      <View style={{ flex: 4 }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => { handlePost() }}
        >
          <Text style={styles.txt}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => { handleOpenCamera() }}
        >
          <Text style={styles.txt}>openCamera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => { handleOpenGallery() }}
        >
          <Text style={styles.txt}>openGallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setProgress(pre => pre - 2)
            ref.current.seek(progress)
          }}
        >
          <Text style={styles.txt}>-10</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default App

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'cyan', height: 50, width: 120, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center'
  },
  txt: {
    color: 'red', fontWeight: 'bold'
  }
})

