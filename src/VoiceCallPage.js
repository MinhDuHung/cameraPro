// App.js
import React from 'react';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { StyleSheet, View, Image } from 'react-native';

export default function VoiceCallPage({ route, navigation }) {
    const { name } = route.params
    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={1884864967}
                appSign={'3b7475d9aaba8cf9aa3a773e0bd3e7a90945221f87bc85055bfbb91bb57729ce'}
                userID={name} // userID can be something like a phone number or the user id on your own user system. 
                userName={name}
                callID={'myCallId'} // callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onOnlySelfInRoom: () => { navigation.navigate('home') },
                    onHangUp: () => { navigation.navigate('home') },
                    avatarBuilder: ({ userInfo }) => {
                        return <View style={{ width: '100%', height: '100%' }}>
                            <Image
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                                source={{ uri: `https://robohash.org/${100}.png` }}
                            />
                        </View>
                    },
                }}

            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})