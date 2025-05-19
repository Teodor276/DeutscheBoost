// DeutscheBoost_frontend/screens/HistoryScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, useAuthToken } from "../utils/api";

export default function HistoryScreen() {
  const token = useAuthToken();

  const [lists,   setLists]   = useState([]);
  const [active,  setActive]  = useState(null);
  const [cards,   setCards]   = useState([]);
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  /* fetch deck names */
  const fetchLists = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/lists`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setLists(d.lists ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(fetchLists, [fetchLists]);

  /* load a single deck */
  const loadDeck = (name) => {
    fetch(`${API_URL}/translations?list=${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r  => r.json())
      .then(d  => { setCards(d); setActive(name); setIndex(0); setFlipped(false); })
      .catch(console.error);
  };

  const current = cards[index];

  return (
    <View
      style={[
        styles.container,
        { paddingTop: active ? 200 : 40 }
      ]}
    >
      {/* ---------- Deck list screen ---------- */}
      {!active ? (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Your Flashcard Decks</Text>
            <Pressable
              onPress={fetchLists}
              style={styles.reloadBtn}
              disabled={loading}
            >
              <Ionicons
                name="refresh"
                size={22}
                color={loading ? "#64748b" : "#38bdf8"}
              />
            </Pressable>
          </View>

          <ScrollView>
            {lists.map((name) => (
              <Pressable key={name} style={styles.deck} onPress={() => loadDeck(name)}>
                <Text style={styles.deckText}>{name}</Text>
              </Pressable>
            ))}
            {lists.length === 0 && !loading && (
              <Text style={styles.empty}>No decks yet. Translate a phrase first.</Text>
            )}
          </ScrollView>
        </>
      ) : (
      /* ----------- Flashcard screen ----------- */
        <View style={styles.flash}>
          <Text style={styles.deckTitle}>Deck: {active}</Text>

          <TouchableOpacity
            style={styles.card}
            disabled={!current}
            onPress={() => setFlipped(!flipped)}
          >
            {/* scrollable text inside the card */}
            <ScrollView contentContainerStyle={styles.cardScroll}>
              <Text style={styles.cardText}>
                {current
                  ? flipped ? current.phrase : current.translation
                  : "Empty deck"}
              </Text>
            </ScrollView>
          </TouchableOpacity>

          {/* arrows */}
          <View style={styles.nav}>
            <Pressable
              onPress={() => { setIndex(i => Math.max(i - 1, 0)); setFlipped(false); }}
              style={styles.arrow}
            >
              <Text style={styles.arrowText}>←</Text>
            </Pressable>

            <Text style={styles.counter}>
              {cards.length ? `${index + 1}/${cards.length}` : "0/0"}
            </Text>

            <Pressable
              onPress={() => { setIndex(i => Math.min(i + 1, cards.length - 1)); setFlipped(false); }}
              style={styles.arrow}
            >
              <Text style={styles.arrowText}>→</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => setActive(null)}>
            <Text style={styles.back}>← Back to Decks</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0c0c",
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reloadBtn: { padding: 6 },
  title: { fontSize: 22, fontWeight: "600", color: "#f8fafc" },

  deck:  { padding: 12, backgroundColor: "#1e2530", borderRadius: 8, marginBottom: 8 },
  deckText: { color: "#f1f5f9", fontSize: 18 },
  empty: { color: "#64748b", marginTop: 20, textAlign: "center" },

  flash: { flex: 1, alignItems: "center" },
  deckTitle: { color: "#94a3b8", fontSize: 16, marginBottom: 10 },

  /* card with inner scroll */
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginVertical: 20,
    width: "100%",
    maxHeight: "55%",        // prevents taking whole screen
  },
  cardScroll: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  cardText: { color: "#38bdf8", fontSize: 24, fontWeight: "600", textAlign: "center", padding: 20 },

  nav: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 10 },
  arrow: { padding: 10 },
  arrowText: { color: "#f8fafc", fontSize: 24 },
  counter: { color: "#cbd5e1", fontSize: 16 },
  back: { marginTop: 20, color: "#94a3b8" },
});
