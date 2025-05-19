// screens/PhrasesScreen.js
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PhrasesHome() {
  const nav = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable style={[styles.btn, styles.add]} onPress={() => nav.navigate("AddPhrase")}>
        <Text style={styles.txt}>Add Phrase</Text>
      </Pressable>

      <Pressable style={[styles.btn, styles.review]} onPress={() => nav.navigate("ReviewPhrases")}>
        <Text style={styles.txt}>Review Phrases</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#0e0c0c", justifyContent:"center", alignItems:"center", gap:18 },
  btn:{ width:200, paddingVertical:14, borderRadius:9999, alignItems:"center" },
  add:{    backgroundColor:"#2563eb" },
  review:{ backgroundColor:"#38bdf8" },
  txt:{ color:"#f8fafc", fontWeight:"600", fontSize:16 },
});
