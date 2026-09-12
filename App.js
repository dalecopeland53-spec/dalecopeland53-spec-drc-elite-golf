import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
} from 'react-native';

const C = {
  blue: '#0E3153',
  gold: '#B78935',
  bg: '#ECE8DF',
  paper: '#F8F5EE',
  line: '#C9C1B2',
  muted: '#6C7680',
};

const systems = [
  { id: 'SIMULATOR', title: 'DRC Simulator', sub: 'Shot performance', icon: '◉' },
  { id: 'RADAR', title: 'DRC Radar', sub: 'Speed and strike', icon: '⌁' },
  { id: 'MAP', title: 'DRC Map', sub: 'Course and GPS', icon: '◇' },
  { id: 'SYNC', title: 'DRC Sync', sub: 'Connect systems', icon: '↻' },
];

function Home({ open }) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image source={require('./content.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerText}>
          <Text style={styles.brand}>DRC GOLF ELITE</Text>
          <Text style={styles.tag}>4-IN-1 PERFORMANCE SYSTEM</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroSmall}>DRC ELITE GOLF</Text>
        <Text style={styles.heroTitle}>SELECT A SYSTEM</Text>
        <Text style={styles.heroText}>Tap a system to open it.</Text>
      </View>

      <View style={styles.grid}>
        {systems.map(item => (
          <Pressable
            key={item.id}
            onPress={() => open(item.id)}
            android_ripple={{ color: '#D6CEC0' }}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.sub}</Text>
            <View style={styles.openBadge}>
              <Text style={styles.openText}>OPEN</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function SystemPage({ name, home }) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={home} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>‹ HOME</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.brand}>DRC {name}</Text>
          <Text style={styles.tag}>DRC ELITE GOLF</Text>
        </View>
      </View>

      <View style={styles.pageBody}>
        <Text style={styles.pageTitle}>DRC {name}</Text>
        <Text style={styles.ready}>OPEN AND WORKING</Text>
        <Text style={styles.pageText}>This clean rebuild confirms the button and navigation path is working correctly.</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('HOME');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      {screen === 'HOME' ? (
        <Home open={setScreen} />
      ) : (
        <SystemPage name={screen} home={() => setScreen('HOME')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  screen: { flex: 1, backgroundColor: C.bg },
  header: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    backgroundColor: C.paper,
  },
  logo: { width: 48, height: 48, marginRight: 10 },
  headerText: { flex: 1 },
  brand: { color: C.blue, fontSize: 18, fontWeight: '900' },
  tag: { color: C.gold, fontSize: 8, fontWeight: '900', letterSpacing: 1, marginTop: 2 },
  hero: { margin: 12, marginBottom: 10, padding: 16, borderRadius: 12, backgroundColor: C.blue },
  heroSmall: { color: '#D9C8A2', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  heroTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 3 },
  heroText: { color: '#E8EEF4', fontSize: 11, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 12 },
  card: {
    width: '48.5%',
    height: 160,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.65 },
  icon: { color: C.blue, fontSize: 30, fontWeight: '900' },
  cardTitle: { color: C.blue, fontSize: 14, fontWeight: '900', marginTop: 8 },
  cardSub: { color: C.muted, fontSize: 9, marginTop: 3 },
  openBadge: { marginTop: 'auto', alignSelf: 'flex-start', backgroundColor: C.blue, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  openText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900' },
  homeButton: { borderWidth: 1, borderColor: C.blue, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9, marginRight: 10 },
  homeButtonText: { color: C.blue, fontSize: 10, fontWeight: '900' },
  pageBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  pageTitle: { color: C.blue, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  ready: { color: '#2F6B4F', fontSize: 13, fontWeight: '900', marginTop: 14, letterSpacing: 1 },
  pageText: { color: C.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10, maxWidth: 300 },
});
