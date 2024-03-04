import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LinearGradient from 'react-native-linear-gradient'
import { songsList } from './Songs.js'
import TrackPlayer, { Capability, State, usePlaybackState, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider'

const { width, height } = Dimensions.get('window')
const MusicPlayer = () => {
  const [currentIdx, setCurrentIdx] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const prog = useProgress()

  const [isSliding, setIsSliding] = useState(false);

  // Handler khi thanh trượt thay đổi giá trị
  const onSliderValueChange = (value: any) => {
    setIsSliding(true);
    // Tính toán thời gian mới dựa trên giá trị của slider và tổng thời gian bài hát
    const newPosition = value;
    TrackPlayer.seekTo(newPosition); // Seek đến vị trí mới
  };

  // Handler khi thanh trượt kết thúc
  const onSliderSlidingComplete = () => {
    setIsSliding(false);
    // Bắt đầu phát lại nếu đang ở chế độ phát nhạc
    if (isPlaying) {
      TrackPlayer.play();
    }
  };

  const renderItem1 = ({ item, idx }: any) => {
    return (
      <View style={{ flex: 1 }}>
        <Image style={styles.img} source={{ uri: item.artwork }} />
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Text>{item.title}</Text>
            <Text>{item.artist}</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderItem2 = ({ item, idx }: any) => {
    return (
      <TouchableOpacity
        onPress={() => setCurrentIdx(parseInt(item.id))}
        style={{ flex: 1, flexDirection: "row", gap: 20 }}>
        <Image style={styles.img2} source={{ uri: item.artwork }} />
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Text>{item.title}</Text>
            <Text>{item.artist}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    setupPlayer()
    //addEventListeners();
  }, [])

  // const addEventListeners = async () => {
  //   TrackPlayer.addEventListener('', ({ state }) => {
  //     setIsPlaying(state === TrackPlayer.STATE_PLAYING);
  //   });

  //   TrackPlayer.addEventListener('playback-track-changed', async ({ nextTrack }) => {
  //     // Khi bài hát kết thúc, nextTrack sẽ trở thành null
  //     if (!nextTrack) {
  //       // Bài hát đã kết thúc, thực hiện logic chuyển sang bài hát tiếp theo
  //       await TrackPlayer.skipToNext();
  //     }
  //   });
  // };

  async function setupPlayer() {
    try {
      await TrackPlayer.setupPlayer()
      await TrackPlayer.add(songsList)
      await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],

        // Icons for the notification on Android (if you don't like the default ones)
        // playIcon: require('./play-icon.png'),
        // pauseIcon: require('./pause-icon.png'),
        // stopIcon: require('./stop-icon.png'),
        // previousIcon: require('./previous-icon.png'),
        // nextIcon: require('./next-icon.png'),
        // icon: require('./notification-icon.png')
      });
    } catch (error) {
      console.error(error)
    }
  }

  const [zIn, setZIn] = useState(false)

  const format = (seconds: any) => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
      <View style={{ flex: 1 }}>
        <AntDesign size={25} color={'white'} name="caretright" />
      </View>
      <View style={{ flex: 5, paddingHorizontal: width - width * .9, }}>
        {/* <FlatList
          data={songsList}
          renderItem={renderItem1}
          horizontal
          pagingEnabled
          initialScrollIndex={currentIdx}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: width * 0.8,
            offset: width * 0.8 * index,
            index,
          })}
        /> */}
        <View style={{ flex: 1 }}>
          <Image style={styles.img}
            source={{ uri: songsList[currentIdx - 1].artwork }}
          />
        </View>

      </View>
      <View style={{ flex: 4, paddingHorizontal: width - width * .9, }}>
        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
          <AntDesign onPress={() => {

          }}
            size={25} color={'white'} name="swap"
          />
          {
            !isPlaying ? (
              <AntDesign
                onPress={async () => {
                  setZIn(true)
                  setIsPlaying(true);
                  await TrackPlayer.skip(currentIdx - 1);
                  await TrackPlayer.play();
                }
                }
                size={25}
                color={'white'}
                name="caretright"
              />
            ) : (
              <AntDesign
                onPress={async () => {
                  setIsPlaying(false);
                  await TrackPlayer.pause();
                }}
                size={25}
                color={'white'}
                name="pausecircle"
              />
            )
          }

        </View>
        <FlatList
          data={songsList}
          renderItem={renderItem2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 15 }}
        />
      </View>
      {
        zIn ? <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={[styles.modal, { zIndex: 0 }]}>
          <AntDesign size={30} color={'white'} name="pausecircle" />
          <View >
            <Text style={styles.txt}>{songsList[currentIdx - 1].title}</Text>
            <Text style={styles.txt}>{songsList[currentIdx - 1].artist}</Text>
          </View>

        </TouchableOpacity>
          : <></>
      }

      <Modal
        visible={showModal}
        animationType='slide'
      >
        <LinearGradient
          colors={['#0878', '#0707']}
          style={styles.detail}>
          <View style={{ flex: 1 }}>
            <AntDesign onPress={() => setShowModal(false)} size={25} color={'white'} name="left" />
          </View>
          <View style={{ flex: 5, paddingHorizontal: width - width * .9, }}>
            <View style={{ flex: 1 }}>
              <Image style={styles.img}
                source={{ uri: songsList[currentIdx - 1].artwork }}
              />
            </View>
            <View >
              <Text style={styles.txt}>{songsList[currentIdx - 1].title}</Text>
              <Text style={styles.txt}>{songsList[currentIdx - 1].artist}</Text>
            </View>
            <Slider
              style={{ width: 300, height: 40 }}
              value={prog.position}
              minimumValue={0}
              maximumValue={prog.duration}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              step={0.01}
              onValueChange={onSliderValueChange}
              onSlidingComplete={onSliderSlidingComplete}
            />
          </View>
          <View style={{ flex: 4, paddingHorizontal: width - width * .9, }}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', }}>
              <Text style={{ color: 'white' }}>{format(prog.position)}</Text>
              <Text style={{ color: 'white' }}>{format(prog.duration)}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-between', }}>
              <AntDesign size={40} color={'white'} name="banckward" />
              {
                isPlaying ?
                  < AntDesign
                    onPress={async () => {
                      setIsPlaying(false)
                      await TrackPlayer.pause()
                    }
                    }
                    size={50} color={'white'} name="pausecircle" />
                  :
                  <AntDesign
                    onPress={async () => {
                      setIsPlaying(true)
                      await TrackPlayer.play()
                    }
                    }
                    size={50} color={'white'} name="caretright" />

              }
              <AntDesign
                onPress={async () => {
                  await TrackPlayer.pause()
                  if (currentIdx - 1 < songsList.length - 1) {
                    setCurrentIdx(pre => pre + 1)
                    await TrackPlayer.skipToNext()
                  }
                  else {
                    console.log(1)
                    setCurrentIdx(1)
                    await TrackPlayer.skip(0)
                  }
                  await TrackPlayer.play()
                }
                }
                size={40} color={'white'} name="forward" />
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  )
}

export default MusicPlayer


const styles = StyleSheet.create({
  detail: {
    height: height, width: width,
  },
  txt: {
    color: 'white'
  },
  linearGradient: {
    flex: 1
  },
  img: {
    height: height * .4, width: width * .8,
    borderRadius: 15
  },
  img2: {
    height: width * .15, width: width * .15,
    borderRadius: 5
  },
  modal: {
    backgroundColor: 'rgba(000,000,000,.7)', alignItems: 'center', paddingHorizontal: 20,
    height: 70, width: width, position: 'absolute', bottom: 0, flexDirection: 'row', gap: 20
  }
})