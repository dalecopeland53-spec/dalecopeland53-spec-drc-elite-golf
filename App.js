import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';

const BLUE = '#0E3153';
const BLUE2 = '#174F7A';
const GOLD = '#B78935';
const BG = '#ECE8DF';
const PAPER = '#F8F5EE';
const PANEL = '#E3DED3';
const LINE = '#C9C1B2';
const INK = '#102A42';
const MUTED = '#6C7680';
const GREEN = '#2F6B4F';

const SYSTEMS = [
  { key: 'SIM', label: 'DRC Simulator', icon: '◉', sub: 'Shot performance' },
  { key: 'RADAR', label: 'DRC Radar', icon: '⌁', sub: 'Speed and strike' },
  { key: 'MAP', label: 'DRC Map', icon: '◇', sub: 'Course and GPS' },
  { key: 'SYNC', label: 'DRC Sync', icon: '↻', sub: 'Connect systems' },
];

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      {!!title && <Text style={styles.cardTitle}>{title}</Text>}
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

export default function App() {
  const [screen, setScreen] = useState('HOME');
  const [metric, setMetric] = useState(true);
  const [connected, setConnected] = useState(false);

  const openSystem = key => setScreen(key);
  const goHome = () => setScreen('HOME');

  const unitButton = (
    <TouchableOpacity style={styles.unitButton} onPress={() => setMetric(v => !v)}>
      <Text style={styles.unitButtonText}>{metric ? 'METRIC' : 'IMPERIAL'}</Text>
    </TouchableOpacity>
  );

  const Header = ({ title = 'DRC GOLF ELITE', back = false }) => (
    <View style={styles.header}>
      {back ? (
        <TouchableOpacity style={styles.backButton} onPress={goHome}>
          <Text style={styles.backButtonText}>‹ HOME</Text>
        </TouchableOpacity>
      ) : (
        <Image source={require('./content.png')} style={styles.logo} resizeMode="contain" />
      )}
      <View style={styles.headerText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{back ? 'DRC ELITE 4-IN-1' : '4-IN-1 PERFORMANCE SYSTEM'}</Text>
      </View>
      {unitButton}
    </View>
  );

  const Home = () => (
    <View style={styles.page}>
      <Header />
      <ScrollView contentContainerStyle={styles.homeScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroSmall}>DRC ELITE GOLF</Text>
          <Text style={styles.heroTitle}>SELECT A SYSTEM</Text>
          <Text style={styles.heroText}>Tap any system below to open it.</Text>
        </View>

        <View style={styles.launchGrid}>
          {SYSTEMS.map(item => (
            <TouchableOpacity
              key={item.key}
              style={styles.launchCard}
              activeOpacity={0.8}
              onPress={() => openSystem(item.key)}
            >
              <Text style={styles.launchIcon}>{item.icon}</Text>
              <Text style={styles.launchTitle}>{item.label}</Text>
              <Text style={styles.launchSub}>{item.sub}</Text>
              <View style={styles.openPill}>
                <Text style={styles.openPillText}>OPEN</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const Simulator = () => (
    <View style={styles.page}>
      <Header title="DRC SIMULATOR" back />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title="SIMULATOR LIVE">
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Tracking Status</Text>
            <Text style={styles.ready}>READY</Text>
          </View>
          <View style={styles.twoCol}>
            <Metric label="DISTANCE" value={metric ? '250.8 m' : '274.3 yd'} />
            <Metric label="SHOT" value="225" />
          </View>
          <View style={styles.twoCol}>
            <Metric label="CLUB SPEED" value={metric ? '180 kph' : '111.8 mph'} />
            <Metric label="TEMPO" value="3.1 : 1" />
          </View>
        </Card>
        <Card title="RECENT RUNS">
          {['#084  •  183 kph  •  3.1 : 1', '#083  •  177 kph  •  3.0 : 1', '#082  •  180 kph  •  3.2 : 1'].map(row => (
            <Text key={row} style={styles.historyRow}>{row}</Text>
          ))}
        </Card>
      </ScrollView>
    </View>
  );

  const Radar = () => (
    <View style={styles.page}>
      <Header title="DRC RADAR" back />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title="RADAR LIVE">
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Tracking Status</Text>
            <Text style={styles.ready}>READY</Text>
          </View>
          <View style={styles.twoCol}>
            <Metric label="CLUB SPEED" value={metric ? '180 kph' : '111.8 mph'} />
            <Metric label="BALL SPEED" value={metric ? '246 kph' : '152.9 mph'} />
          </View>
          <View style={styles.twoCol}>
            <Metric label="SMASH" value="1.37" />
            <Metric label="TEMPO" value="3.1 : 1" />
          </View>
        </Card>
      </ScrollView>
    </View>
  );

  const Map = () => (
    <View style={styles.page}>
      <Header title="DRC MAP" back />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title="COURSE MAP">
          <View style={styles.mapBox}>
            <Text style={styles.flag}>⚑</Text>
            <View style={styles.playerDot} />
            <Text style={styles.mapText}>GPS COURSE VIEW</Text>
          </View>
          <View style={styles.threeCol}>
            <Metric label="FRONT" value={metric ? '142 m' : '155 yd'} />
            <Metric label="CENTRE" value={metric ? '151 m' : '165 yd'} />
            <Metric label="BACK" value={metric ? '160 m' : '175 yd'} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );

  const Sync = () => (
    <View style={styles.page}>
      <Header title="DRC SYNC" back />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title="DRC SYNC">
          <View style={styles.syncHero}>
            <Text style={styles.syncIcon}>↻</Text>
            <Text style={styles.syncTitle}>{connected ? 'CONNECTED' : 'READY TO CONNECT'}</Text>
            <Text style={styles.syncText}>Connect Simulator, Radar and Map inside one Elite Golf session.</Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setConnected(v => !v)}>
            <Text style={styles.primaryButtonText}>{connected ? 'DISCONNECT' : 'CONNECT DRC SYNC'}</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      {screen === 'HOME' && <Home />}
      {screen === 'SIM' && <Simulator />}
      {screen === 'RADAR' && <Radar />}
      {screen === 'MAP' && <Map />}
      {screen === 'SYNC' && <Sync />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  page: { flex: 1, backgroundColor: BG },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    backgroundColor: PAPER,
  },
  logo: { width: 46, height: 46, marginRight: 8 },
  backButton: {
    minWidth: 58,
    height: 36,
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backButtonText: { color: BLUE, fontSize: 9, fontWeight: '900' },
  headerText: { flex: 1 },
  title: { color: BLUE, fontSize: 18, fontWeight: '900', letterSpacing: 0.6 },
  subtitle: { color: GOLD, fontSize: 7.5, fontWeight: '900', letterSpacing: 1, marginTop: 1 },
  unitButton: { borderWidth: 1, borderColor: BLUE, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 7 },
  unitButtonText: { color: BLUE, fontSize: 7.5, fontWeight: '900' },
  homeScroll: { padding: 10, paddingBottom: 18 },
  hero: { backgroundColor: BLUE, borderRadius: 12, padding: 14, marginBottom: 10 },
  heroSmall: { color: '#D9C8A2', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  heroTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '900', marginTop: 2 },
  heroText: { color: '#E8EEF4', fontSize: 10, marginTop: 3 },
  launchGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  launchCard: {
    width: '48.7%',
    minHeight: 150,
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 12,
    padding: 12,
    marginBottom: 9,
  },
  launchIcon: { color: BLUE, fontSize: 28, fontWeight: '900' },
  launchTitle: { color: BLUE, fontSize: 14, fontWeight: '900', marginTop: 8 },
  launchSub: { color: MUTED, fontSize: 9, marginTop: 3 },
  openPill: { alignSelf: 'flex-start', marginTop: 'auto', backgroundColor: BLUE, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  openPillText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  scroll: { padding: 10, paddingBottom: 20 },
  card: { backgroundColor: PAPER, borderWidth: 1, borderColor: LINE, borderRadius: 12, padding: 10, marginBottom: 8 },
  cardTitle: { color: BLUE, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PANEL, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7, marginBottom: 7 },
  statusLabel: { color: MUTED, fontSize: 9, fontWeight: '800' },
  ready: { color: GREEN, fontSize: 9, fontWeight: '900' },
  twoCol: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  threeCol: { flexDirection: 'row', gap: 6, marginTop: 7 },
  metricBox: { flex: 1, minHeight: 62, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: LINE, borderRadius: 9, padding: 8, justifyContent: 'center' },
  metricLabel: { color: MUTED, fontSize: 7.5, fontWeight: '900', letterSpacing: 0.7, marginBottom: 4 },
  metricValue: { color: INK, fontSize: 15, fontWeight: '900' },
  historyRow: { color: INK, fontSize: 11, fontWeight: '700', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E7E1D7' },
  mapBox: { height: 220, borderRadius: 10, backgroundColor: '#DDE3DC', borderWidth: 1, borderColor: LINE, alignItems: 'center', justifyContent: 'center' },
  flag: { color: BLUE, fontSize: 30 },
  playerDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: GOLD, borderWidth: 2, borderColor: '#FFFFFF', marginTop: 38 },
  mapText: { color: BLUE2, fontWeight: '900', fontSize: 10, letterSpacing: 1.3, marginTop: 8 },
  syncHero: { alignItems: 'center', paddingVertical: 18 },
  syncIcon: { color: BLUE, fontSize: 42, fontWeight: '900' },
  syncTitle: { color: BLUE, fontSize: 16, fontWeight: '900', marginTop: 4 },
  syncText: { color: MUTED, textAlign: 'center', fontSize: 9, lineHeight: 14, marginTop: 5, maxWidth: 270 },
  primaryButton: { minHeight: 44, backgroundColor: BLUE, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.9 },
});
