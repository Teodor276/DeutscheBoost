// screens/ReviewPhrasesScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useApi } from "../utils/api";

/* -------- shuffle helper -------- */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function ReviewPhrasesScreen() {
  const nav              = useNavigation();
  const { fetchWithAuth} = useApi();

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flip,  setFlip ] = useState(false);

  /* load & shuffle once */
  useEffect(() => {
    fetchWithAuth(`${API_URL}/phrases`)
      .then(r => r.json())
      .then(d => { setCards(shuffle(d)); setIndex(0); setFlip(false); })
      .catch(console.error);
  }, []);

  const current = cards[index];

  return (
    <View style={styles.container}>
      {/* back */}
      <Pressable onPress={() => nav.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      {/* flash-card */}
      <TouchableOpacity
        style={styles.card}
        disabled={!current}
        onPress={() => setFlip(!flip)}
      >
        <ScrollView contentContainerStyle={styles.cardInner}>
          <Text style={styles.cardTxt}>
            {current
              ? (flip ? current.phrase : current.translation)
              : "No phrases yet"}
          </Text>
        </ScrollView>
      </TouchableOpacity>

      {/* arrows */}
      <View style={styles.nav}>
        <Pressable onPress={() => { setIndex(i => Math.max(i - 1, 0)); setFlip(false); }}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>

        <Text style={styles.counter}>
          {cards.length ? `${index + 1}/${cards.length}` : "0/0"}
        </Text>

        <Pressable onPress={() => { setIndex(i => Math.min(i + 1, cards.length - 1)); setFlip(false); }}>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* -------- styles -------- */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#0e0c0c", padding:16, alignItems:"center", paddingTop:250 },
  back:{ alignSelf:"flex-start", marginBottom:12 },
  backText:{ color:"#94a3b8", fontSize:16 },
  card:{ backgroundColor:"#1e293b", borderRadius:12, width:"100%", maxHeight:"55%", marginTop:20 },
  cardInner:{ flexGrow:1, justifyContent:"center", alignItems:"center", padding:24 },
  cardTxt:{ color:"#38bdf8", fontSize:24, fontWeight:"600", textAlign:"center" },
  nav:{ flexDirection:"row", alignItems:"center", gap:20, marginTop:20 },
  arrow:{ color:"#f8fafc", fontSize:28 },
  counter:{ color:"#cbd5e1", fontSize:16 },
});
