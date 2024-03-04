import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

const Home = ({ navigation }: any) => {
    const [name, setName] = useState('')
    return (
        <View style={{ flex: 1, backgroundColor: 'cyan', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput style={{height:50, width:150, backgroundColor:'white'}} value={name} onChangeText={x => setName(x)} />
            <Button
                onPress={() => navigation.navigate("callpage", {
                    name
                })}
                title='Join'
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})