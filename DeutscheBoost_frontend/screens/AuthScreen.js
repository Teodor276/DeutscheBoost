import React, { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { useAuth } from "../utils/auth";

export default function AuthScreen() {

  const { signIn } = useAuth();
  const [email, setEmail]       = useState("");
  const [pw,    setPw]          = useState("");
  const [newAcc,setNewAcc]      = useState(false);
  const login = () => signIn(email.trim(), pw, newAcc).catch(e=>alert(e.message));

  return (

    <View style={styles.container}
    >
      <TextInput style={styles.inp} placeholder="email"  onChangeText={setEmail} value={email}/>
      <TextInput style={styles.inp} placeholder="password" secureTextEntry onChangeText={setPw} value={pw}/>

      <Pressable style={styles.btn} onPress={login}>
        <Text style={styles.txt}>{newAcc ? "Create account" : "Sign in"}</Text>
      </Pressable>

      <Pressable onPress={()=>setNewAcc(!newAcc)}>

      <Text style={styles.link}>
        {newAcc ? "I already have an account" : "I need an account"}
      </Text>
      
      </Pressable>
      
    </View>
  );
}
const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#0e0c0c",justifyContent:"center",alignItems:"center",gap:14},
  inp:{width:"80%",borderColor:"#334155",borderWidth:1.2,borderRadius:8,padding:12,color:"#f1f5f9",backgroundColor:"#1e2530"},
  btn:{backgroundColor:"#2563eb",paddingVertical:12,paddingHorizontal:30,borderRadius:9999},
  txt:{color:"#f8fafc",fontWeight:"600"},
  link:{color:"#94a3b8",marginTop:8}
});
