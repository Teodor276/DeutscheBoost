// DeutscheBoost_frontend/screens/HistoryScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, useApi } from "../utils/api";

/* ---------- helpers ---------- */
const shuffle = (a) => {
  const arr = [...a];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;

};

const dedup = (arr) => {

  const seen = new Set();

  return arr.filter((it) => {
    const key = `${it.phrase}|${it.translation}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

};

export default function HistoryScreen() {
  const { fetchWithAuth } = useApi();

  /* ---------- state ---------- */
  const [lists,   setLists]   = useState([]);
  const [active,  setActive]  = useState(null);
  const [cards,   setCards]   = useState([]);
  const [idx,     setIdx]     = useState(0);
  const [flip,    setFlip]    = useState(false);
  const [busy,    setBusy]    = useState(false);

  /* ---------- initial load (ONCE) ---------- */
  useEffect(() => {
    refreshLists();
  }, []);

  const refreshLists = async () => {
    if (busy) 
      return;

    setBusy(true);

    try {
      const res   = await fetchWithAuth(`${API_URL}/lists`);
      const json  = await res.json();
      setLists(json.lists ?? []);

    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  /* ---------- open a deck ---------- */
  const openDeck = async (name) => {

    try {
      const r   = await fetchWithAuth(`${API_URL}/translations?list=${name}`);
      const arr = await r.json();

      setCards(shuffle(dedup(arr)));
      setActive(name);
      setIdx(0);
      setFlip(false);

    } catch (err) {
      console.error(err);
    }
  };

  const current = cards[idx];

  return (
    <View style={[styles.container, { paddingTop: active ? 200 : 40 }]}>
      {/* -------- deck list view -------- */}
      {!active ? (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Your Flashcard Decks</Text>

            <Pressable
              onPress={refreshLists}
              style={styles.reloadBtn}
              disabled={busy}
            >
              <Ionicons
                name="refresh"
                size={22}
                color={busy ? "#64748b" : "#38bdf8"}
              />

            </Pressable>
          </View>

          <ScrollView>
            {lists.map((name) => (
              <Pressable
                key={name}
                style={styles.deck}
                onPress={() => openDeck(name)}
              >
                <Text style={styles.deckText}>{name}</Text>
              </Pressable>
            ))}

            {lists.length === 0 && !busy && (
              <Text style={styles.empty}>
                No decks yet. Translate a phrase first.
              </Text>
            )}

          </ScrollView>

        </>
      ) : (
        /* -------- flashcard view -------- */
        <View style={styles.flash}>
          <Text style={styles.deckTitle}>Deck: {active}</Text>

          <TouchableOpacity
            style={styles.card}
            disabled={!current}
            onPress={() => setFlip(!flip)}
          >
            <ScrollView contentContainerStyle={styles.cardScroll}>
              <Text style={styles.cardText}>
                {current
                  ? flip
                    ? current.phrase
                    : current.translation
                  : "Empty deck"}
              </Text>
            </ScrollView>
          </TouchableOpacity>

          {/* nav arrows */}
          <View style={styles.nav}>
            <Pressable
              onPress={() => {
                setIdx((i) => Math.max(i - 1, 0));
                setFlip(false);
              }}
            >
              <Text style={styles.arrow}>←</Text>
            </Pressable>

            <Text style={styles.counter}>
              {cards.length ? `${idx + 1}/${cards.length}` : "0/0"}
            </Text>

            <Pressable
              onPress={() => {
                setIdx((i) => Math.min(i + 1, cards.length - 1));
                setFlip(false);
              }}
            >
              <Text style={styles.arrow}>→</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0c0c", paddingHorizontal: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reloadBtn: { padding: 6 },
  title: { fontSize: 22, fontWeight: "600", color: "#f8fafc" },

  deck: {
    padding: 12,
    backgroundColor: "#1e2530",
    borderRadius: 8,
    marginBottom: 8,
  },
  deckText: { color: "#f1f5f9", fontSize: 18 },
  empty: { color: "#64748b", marginTop: 20, textAlign: "center" },

  flash: { flex: 1, alignItems: "center" },
  deckTitle: { color: "#94a3b8", fontSize: 16, marginBottom: 10 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginVertical: 20,
    width: "100%",
    maxHeight: "55%",
  },
  cardScroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  cardText: {
    color: "#38bdf8",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },

  nav: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 10 },
  arrow: { color: "#f8fafc", fontSize: 28 },
  counter: { color: "#cbd5e1", fontSize: 16 },
  back: { marginTop: 20, color: "#94a3b8" },
});
