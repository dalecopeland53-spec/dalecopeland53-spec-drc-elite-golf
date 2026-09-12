import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  ScrollView,
} from 'react-native';

const C = {
  blue: '#0E3153',
  blue2: '#174F7A',
  gold: '#B78935',
  bg: '#ECE8DF',
  paper: '#F8F5EE',
  panel: '#E3DED3',
  line: '#C9C1B2',
  muted: '#6C7680',
  ink: '#102A42',
  green: '#2F6B4F',
  white: '#FFFFFF',
};

const systems = [
  { id: 'SIMULATOR', title: 'DRC Simulator', sub: 'Shot performance', icon: '◉' },
  { id: 'RADAR', title: 'DRC Radar', sub: 'Speed and strike', icon: '⌁' },
  { id: 'MAP', title: 'DRC Map', sub: 'Course and GPS', icon: '◇' },
  { id: 'SYNC', title: 'DRC Sync', sub: 'Connect systems', icon: '↻' },
];

function Header({ title, home, metric, toggleUnits }) {
  return (
    <View style={styles.header}>
      {home ? (
        <Pressable onPress={home} style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]} hitSlop={8}>
          <Text style={styles.homeButtonText}>‹ HOME</Text>
        </Pressable>
      ) : (
        <Image source={require('./content.png')} style={styles.logo} resizeMode="contain" />
      )}
      <View style={styles.headerText}>
        <Text style={styles.brand}>{title || 'DRC GOLF ELITE'}</Text>
        <Text style={styles.tag}>{home ? 'DRC ELITE GOLF' : '4-IN-1 PERFORMANCE SYSTEM'}</Text>
      </View>
      <Pressable onPress={toggleUnits} style={({ pressed }) => [styles.unitButton, pressed && styles.pressed]}>
        <Text style={styles.unitText}>{metric ? 'METRIC' : 'IMPERIAL'}</Text>
      </Pressable>
    </View>
  );
}

function Home({ open, metric, toggleUnits }) {
  return (
    <View style={styles.screen}>
      <Header metric={metric} toggleUnits={toggleUnits} />
      <ScrollView contentContainerStyle={styles.homeScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroSmall}>DRC ELITE GOLF</Text>
          <Text style={styles.heroTitle}>SELECT A SYSTEM</Text>
          <Text style={styles.heroText}>Four systems. One clean working base.</Text>
        </View>

        <View style={styles.grid}>
          {systems.map(item => (
            <Pressable
              key={item.id}
              onPress={() => open(item.id)}
              android_ripple={{ color: '#D6CEC0' }}
              hitSlop={5}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.title}`}
              style={({ pressed }) => [styles.launchCard, pressed && styles.pressed]}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
              <View style={styles.openBadge} pointerEvents="none">
                <Text style={styles.openText}>OPEN</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Panel({ title, children }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function Simulator({ home, metric, toggleUnits }) {
  return (
    <View style={styles.screen}>
      <Header title="DRC SIMULATOR" home={home} metric={metric} toggleUnits={toggleUnits} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Panel title="SIMULATOR LIVE">
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Tracking Status</Text>
            <Text style={styles.ready}>READY</Text>
          </View>
          <View style={styles.row}>
            <Metric label="DISTANCE" value={metric ? '250.8 m' : '274.3 yd'} />
            <Metric label="SHOT" value="225" />
          </View>
          <View style={styles.row}>
            <Metric label="CLUB SPEED" value={metric ? '180 kph' : '111.8 mph'} />
            <Metric label="TEMPO" value="3.1 : 1" />
          </View>
        </Panel>
        <Panel title="RECENT RUNS">
          <Text style={styles.history}>#084   183 kph   3.1 : 1</Text>
          <Text style={styles.history}>#083   177 kph   3.0 : 1</Text>
          <Text style={styles.history}>#082   180 kph   3.2 : 1</Text>
        </Panel>
      </ScrollView>
    </View>
  );
}

function Radar({ home, metric, toggleUnits }) {
  return (
    <View style={styles.screen}>
      <Header title="DRC RADAR" home={home} metric={metric} toggleUnits={toggleUnits} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Panel title="RADAR LIVE">
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Tracking Status</Text>
            <Text style={styles.ready}>READY</Text>
          </View>
          <View style={styles.row}>
            <Metric label="CLUB SPEED" value={metric ? '180 kph' : '111.8 mph'} />
            <Metric label="BALL SPEED" value={metric ? '246 kph' : '152.9 mph'} />
          </View>
          <View style={styles.row}>
            <Metric label="SMASH" value="1.37" />
            <Metric label="TEMPO" value="3.1 : 1" />
          </View>
        </Panel>
        <Panel title="STRIKE">
          <View style={styles.strikeBox}>
            <View style={styles.strikeDot} />
            <Text style={styles.strikeText}>CENTRE STRIKE</Text>
          </View>
        </Panel>
      </ScrollView>
    </View>
  );
}

function MapScreen({ home, metric, toggleUnits }) {
  return (
    <View style={styles.screen}>
      <Header title="DRC MAP" home={home} metric={metric} toggleUnits={toggleUnits} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Panel title="COURSE MAP">
          <View style={styles.mapBox}>
            <Text style={styles.flag}>⚑</Text>
            <View style={styles.playerDot} />
            <Text style={styles.mapText}>GPS COURSE VIEW</Text>
          </View>
          <View style={styles.threeRow}>
            <Metric label="FRONT" value={metric ? '142 m' : '155 yd'} />
            <Metric label="CENTRE" value={metric ? '151 m' : '165 yd'} />
            <Metric label="BACK" value={metric ? '160 m' : '175 yd'} />
          </View>
        </Panel>
        <Panel title="CURRENT HOLE">
          <View style={styles.holeRow}>
            <Text style={styles.holeBig}>7</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.holeLabel}>PAR 4</Text>
              <Text style={styles.holeText}>{metric ? '386 m' : '422 yd'} • Stroke Index 5</Text>
            </View>
          </View>
        </Panel>
      </ScrollView>
    </View>
  );
}

function Sync({ home, metric, toggleUnits }) {
  const [connected, setConnected] = useState(false);
  return (
    <View style={styles.screen}>
      <Header title="DRC SYNC" home={home} metric={metric} toggleUnits={toggleUnits} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Panel title="DRC SYNC">
          <View style={styles.syncHero}>
            <Text style={styles.syncIcon}>↻</Text>
            <Text style={styles.syncTitle}>{connected ? 'CONNECTED' : 'READY TO CONNECT'}</Text>
            <Text style={styles.syncText}>Link Simulator, Radar and Map in one Elite Golf session.</Text>
          </View>
          <Pressable onPress={() => setConnected(v => !v)} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>{connected ? 'DISCONNECT' : 'CONNECT DRC SYNC'}</Text>
          </Pressable>
        </Panel>
        <Panel title="SYSTEM STATUS">
          {['SIMULATOR', 'RADAR', 'MAP'].map(name => (
            <View key={name} style={styles.statusLine}>
              <Text style={styles.statusName}>{name}</Text>
              <Text style={connected ? styles.ready : styles.standby}>{connected ? 'LINKED' : 'STANDBY'}</Text>
            </View>
          ))}
        </Panel>
      </ScrollView>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('HOME');
  const [metric, setMetric] = useState(true);
  const home = () => setScreen('HOME');
  const toggleUnits = () => setMetric(v => !v);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      {screen === 'HOME' && <Home open={setScreen} metric={metric} toggleUnits={toggleUnits} />}
      {screen === 'SIMULATOR' && <Simulator home={home} metric={metric} toggleUnits={toggleUnits} />}
      {screen === 'RADAR' && <Radar home={home} metric={metric} toggleUnits={toggleUnits} />}
      {screen === 'MAP' && <MapScreen home={home} metric={metric} toggleUnits={toggleUnits} />}
      {screen === 'SYNC' && <Sync home={home} metric={metric} toggleUnits={toggleUnits} />}
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    backgroundColor: C.paper,
  },
  logo: { width: 46, height: 46, marginRight: 8 },
  headerText: { flex: 1 },
  brand: { color: C.blue, fontSize: 18, fontWeight: '900' },
  tag: { color: C.gold, fontSize: 8, fontWeight: '900', letterSpacing: 1, marginTop: 2 },
  unitButton: { borderWidth: 1, borderColor: C.blue, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 7 },
  unitText: { color: C.blue, fontSize: 8, fontWeight: '900' },
  homeButton: { borderWidth: 1, borderColor: C.blue, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 9, marginRight: 8 },
  homeButtonText: { color: C.blue, fontSize: 10, fontWeight: '900' },
  homeScroll: { paddingBottom: 16 },
  hero: { margin: 10, marginBottom: 8, padding: 14, borderRadius: 12, backgroundColor: C.blue },
  heroSmall: { color: '#D9C8A2', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  heroTitle: { color: C.white, fontSize: 23, fontWeight: '900', marginTop: 2 },
  heroText: { color: '#E8EEF4', fontSize: 10, marginTop: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10 },
  launchCard: {
    width: '48.7%',
    height: 150,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 12,
    marginBottom: 9,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.65 },
  icon: { color: C.blue, fontSize: 28, fontWeight: '900' },
  cardTitle: { color: C.blue, fontSize: 14, fontWeight: '900', marginTop: 7 },
  cardSub: { color: C.muted, fontSize: 9, marginTop: 3 },
  openBadge: { marginTop: 'auto', alignSelf: 'flex-start', backgroundColor: C.blue, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 5 },
  openText: { color: C.white, fontSize: 8, fontWeight: '900' },
  scroll: { padding: 10, paddingBottom: 20 },
  panel: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 10, marginBottom: 8 },
  panelTitle: { color: C.blue, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.panel, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7, marginBottom: 7 },
  statusLabel: { color: C.muted, fontSize: 9, fontWeight: '800' },
  ready: { color: C.green, fontSize: 9, fontWeight: '900' },
  standby: { color: C.gold, fontSize: 9, fontWeight: '900' },
  row: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  threeRow: { flexDirection: 'row', gap: 5, marginTop: 7 },
  metricBox: { flex: 1, minHeight: 62, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 9, padding: 8, justifyContent: 'center' },
  metricLabel: { color: C.muted, fontSize: 7.5, fontWeight: '900', letterSpacing: 0.7, marginBottom: 4 },
  metricValue: { color: C.ink, fontSize: 15, fontWeight: '900' },
  history: { color: C.ink, fontSize: 11, fontWeight: '700', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E7E1D7' },
  strikeBox: { height: 120, backgroundColor: C.panel, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  strikeDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.gold, borderWidth: 3, borderColor: C.white },
  strikeText: { color: C.blue, fontSize: 10, fontWeight: '900', marginTop: 8, letterSpacing: 1 },
  mapBox: { height: 210, borderRadius: 10, backgroundColor: '#DDE3DC', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  flag: { color: C.blue, fontSize: 30 },
  playerDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.gold, borderWidth: 2, borderColor: C.white, marginTop: 35 },
  mapText: { color: C.blue2, fontWeight: '900', fontSize: 10, letterSpacing: 1.3, marginTop: 8 },
  holeRow: { flexDirection: 'row', alignItems: 'center' },
  holeBig: { color: C.blue, fontSize: 36, fontWeight: '900', width: 52 },
  holeLabel: { color: C.gold, fontSize: 10, fontWeight: '900' },
  holeText: { color: C.ink, fontSize: 11, fontWeight: '700', marginTop: 3 },
  syncHero: { alignItems: 'center', paddingVertical: 16 },
  syncIcon: { color: C.blue, fontSize: 42, fontWeight: '900' },
  syncTitle: { color: C.blue, fontSize: 16, fontWeight: '900', marginTop: 4 },
  syncText: { color: C.muted, textAlign: 'center', fontSize: 9, lineHeight: 14, marginTop: 5, maxWidth: 270 },
  primaryButton: { minHeight: 44, backgroundColor: C.blue, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: C.white, fontSize: 10, fontWeight: '900', letterSpacing: 0.9 },
  statusLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E7E1D7' },
  statusName: { color: C.ink, fontSize: 10, fontWeight: '800' },
});