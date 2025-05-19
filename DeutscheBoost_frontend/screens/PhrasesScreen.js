// screens/PhrasesScreen.js
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../utils/auth";

export default function PhrasesHome() {
  const nav         = useNavigation();
  const { signOut } = useAuth();       

  return (
    <View style={styles.container}>
      {/* ---------- sign-out button (top-right) ---------- */}
      <Pressable style={styles.logout} onPress={signOut}>
        <Ionicons name="log-out-outline" size={22} color="#94a3b8" />
        <Text style={styles.logoutTxt}>Sign out</Text>
      </Pressable>

      {/* main actions */}
      <Pressable
        style={[styles.btn, styles.add]}
        onPress={() => nav.navigate("AddPhrase")}
      >
        <Text style={styles.txt}>Add Phrase</Text>
      </Pressable>

      <Pressable
        style={[styles.btn, styles.review]}
        onPress={() => nav.navigate("ReviewPhrases")}
      >
        <Text style={styles.txt}>Review Phrases</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#0e0c0c",
    justifyContent:"center",
    alignItems:"center",
    gap:18,
  },

  logout:{
    position:"absolute",
    top:40,
    right:20,
    flexDirection:"row",
    alignItems:"center",
    gap:4,
  },
  logoutTxt:{ color:"#94a3b8", fontSize:14 },

  btn:{ width:200, paddingVertical:14, borderRadius:9999, alignItems:"center" },
  add:{    backgroundColor:"#2563eb" },
  review:{ backgroundColor:"#38bdf8" },
  txt:{ color:"#f8fafc", fontWeight:"600", fontSize:16 },
});
