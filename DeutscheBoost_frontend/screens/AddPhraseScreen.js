// screens/AddPhraseScreen.js
import React, { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useApi } from "../utils/api";


export default function AddPhraseScreen() {

  const [phrase, setPhrase]       = useState("");
  const [translation, setTrans]   = useState("");
  const nav                       = useNavigation();
  const { fetchWithAuth }         = useApi();

  const save = async () => {
    if (!phrase.trim() || !translation.trim()) 
      return;

    try {

      await fetchWithAuth(`${API_URL}/phrases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase, translation }),
      });

      nav.goBack();

    } catch {

      alert("Error saving phrase");
    }
  };

  return (
    
    <View style={styles.container}>
      {/* back button */}
      <Pressable onPress={() => nav.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="German phrase"
        placeholderTextColor="#64748b"
        value={phrase}
        onChangeText={setPhrase}
      />

      <TextInput
        style={styles.input}
        placeholder="English translation"
        placeholderTextColor="#64748b"
        value={translation}
        onChangeText={setTrans}
      />

      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnTxt}>Save</Text>
      </Pressable>

    </View>
    
  );
}

/* -------- styles -------- */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#0e0c0c", padding:20, paddingTop:280, gap:14 },
  back:{ marginBottom:10 },
  backText:{ color:"#94a3b8", fontSize:16 },
  input:{ borderColor:"#334155", borderWidth:1.2, borderRadius:8, padding:12, color:"#f1f5f9", backgroundColor:"#1e2530" },
  btn:{ backgroundColor:"#2563eb", paddingVertical:12, borderRadius:9999, alignItems:"center" },
  btnTxt:{ color:"#f8fafc", fontWeight:"600", fontSize:16 },
});
