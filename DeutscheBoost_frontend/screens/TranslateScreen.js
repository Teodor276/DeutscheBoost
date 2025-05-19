// DeutscheBoost_frontend/screens/TranslateScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { API_URL, useApi } from "../utils/api";

export default function TranslateScreen() {
  /* ------------- state ------------- */
  const [text, setText]           = useState("");
  const [listsCount, setLists]    = useState(0);
  const [listNo, setListNo]       = useState("");
  const [selection, setSel]       = useState({ start: 0, end: 0 });
  const [latest, setLatest]       = useState(null); // { phrase, translation }
  const { fetchWithAuth }         = useApi();

  /* ------------- fetch list count ------------- */
  useEffect(() => {
    (async () => {
      try {
        const res   = await fetchWithAuth(`${API_URL}/lists`);
        const data  = await res.json();
        setLists(data.lists?.length ?? 0);
      } catch {}
    })();
  }, []);

  /* ------------- handlers ------------- */
  const handlePaste = async () => {
    const clip = await Clipboard.getStringAsync();
    if (clip) setText(clip);
  };

  const handleSelectionChange = (e) => {
    const sel = e.nativeEvent.selection;
    if (sel.start !== sel.end) setSel(sel);
  };

  const handleTranslate = async () => {
    if (!listNo.trim()) return alert("Enter a list number first.");
    const phrase = text.substring(selection.start, selection.end).trim();
    if (!phrase)      return alert("Highlight text first, then Translate.");

    try {
      const res = await fetchWithAuth(`${API_URL}/translate_phrase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase, list: `list_${listNo}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || `API ${res.status}`);
      setLatest({ phrase, translation: data.translation });
    } catch (err) {
      alert(err.message);
    }
  };

  /* ------------- render ------------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* deck counter + input */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Lists: {listsCount}</Text>
          <TextInput
            style={styles.listInput}
            placeholder="#"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={listNo}
            onChangeText={setListNo}
          />
        </View>

        {/* main text area */}
        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste German text, highlight, then Translate…"
          placeholderTextColor="#64748b"
          value={text}
          onChangeText={setText}
          selectionColor="#38bdf8"
          onSelectionChange={handleSelectionChange}
        />

        {/* result card */}
        {latest && (
          <View style={styles.card}>
            <Text style={styles.cardPhrase}>{latest.phrase}</Text>
            <Text style={styles.cardArrow}>→</Text>
            <Text style={styles.cardTranslation}>{latest.translation}</Text>
          </View>
        )}

        {/* buttons */}
        <View style={styles.buttonsRow}>
          <Pressable style={styles.btn} onPress={handlePaste}>
            <Text style={styles.btnTxt}>Paste</Text>
          </Pressable>

          <Pressable
            style={[
              styles.btn,
              styles.btnAccent,
              (!text.trim() || !listNo.trim()) && { opacity: 0.35 },
            ]}
            disabled={!text.trim() || !listNo.trim()}
            onPress={handleTranslate}
          >
            <Text style={styles.btnTxt}>Translate</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ------------- styles ------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0e0c0c" },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 40, gap: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoText: { color: "#e2e8f0", fontWeight: "500" },
  listInput: {
    borderColor: "#334155",
    borderWidth: 1.2,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 70,
    textAlign: "center",
    color: "#f8fafc",
    backgroundColor: "#1e2530",
  },
  input: {
    height: Platform.select({ web: 420, ios: 260, android: 260 }),
    borderColor: "#334155",
    borderWidth: 1.2,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    color: "#f1f5f9",
    backgroundColor: "#1e2530",
    lineHeight: 22,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  cardPhrase: { color: "#f8fafc", fontWeight: "600" },
  cardArrow: { color: "#f8fafc", marginHorizontal: 6, fontWeight: "700" },
  cardTranslation: { color: "#38bdf8", fontWeight: "600" },
  buttonsRow: { flexDirection: "row", justifyContent: "center", gap: 14 },
  btn: {
    backgroundColor: "#334155",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  btnAccent: { backgroundColor: "#2563eb" },
  btnTxt: { color: "#f8fafc", fontWeight: "600", fontSize: 16 },
});
