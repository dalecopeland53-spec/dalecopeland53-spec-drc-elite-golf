import React, { useMemo, useState } from 'react';
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

const SHOTS = [
  { id: '#084', speed: 183, tempo: '3.1 : 1' },
  { id: '#083', speed: 177, tempo: '3.0 : 1' },
  { id: '#082', speed: 180, tempo: '3.2 : 1' },
];

const systems = [
  { key: 'SIM', label: 'Simulator', icon: '◉' },
  { key: 'RADAR', label: 'Radar', icon: '⌁' },
  { key: 'MAP', label: 'Map', icon: '◇' },
  { key: 'SYNC', label: 'Sync', icon: '↻' },
];

function Metric({ label, value, small }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, small && styles.metricValueSmall]}>{value}</Text>
    </View>
  );
}

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      {!!title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );
}

export default function App() {
  const [system, setSystem] = useState('SIM');
  const [metric, setMetric] = useState(true);
  const [connected, setConnected] = useState(false);

  const distance = metric ? '250.8 m' : '274.3 yd';
  const speed = metric ? '180 kph' : '111.8 mph';
  const unitLabel = metric ? 'METRIC' : 'IMPERIAL';

  const title = useMemo(() => systems.find(s => s.key === system)?.label || 'Simulator', [system]);

  const renderSimulator = () => (
    <>
      <Card title="DRC SIMULATOR SYSTEM">
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Tracking Status</Text>
          <Text style={styles.ready}>READY</Text>
        </View>
        <View style={styles.twoCol}>
          <Metric label="DISTANCE" value={distance} />
          <Metric label="SHOT" value="225" />
        </View>
        <View style={styles.twoCol}>
          <Metric label="CLUB SPEED" value={speed} />
          <Metric label="TEMPO" value="3.1 : 1" />
        </View>
      </Card>
      <History metric={metric} />
    </>
  );

  const renderRadar = () => (
    <Card title="DRC RADAR SYSTEM">
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Tracking Status</Text>
        <Text style={styles.ready}>READY</Text>
      </View>
      <View style={styles.twoCol}>
        <Metric label="CLUB SPEED" value={speed} />
        <Metric label="SWING" value="225" />
      </View>
      <View style={styles.twoCol}>
        <Metric label="BALL SPEED" value={metric ? '246 kph' : '152.9 mph'} />
        <Metric label="SMASH" value="1.37" />
      </View>
      <Text style={styles.note}>Radar panel is integrated and ready for live sensor data when hardware input is connected.</Text>
    </Card>
  );

  const renderMap = () => (
    <Card title="DRC MAP SYSTEM">
      <View style={styles.mapBox}>
        <View style={styles.flagPole} />
        <Text style={styles.flag}>⚑</Text>
        <View style={styles.playerDot} />
        <Text style={styles.mapText}>COURSE MAP</Text>
      </View>
      <View style={styles.threeCol}>
        <Metric label="FRONT" value={metric ? '142 m' : '155 yd'} small />
        <Metric label="CENTRE" value={metric ? '151 m' : '165 yd'} small />
        <Metric label="BACK" value={metric ? '160 m' : '175 yd'} small />
      </View>
      <Text style={styles.note}>Map module is kept inside this app and can use the course/GPS data layer without opening another app.</Text>
    </Card>
  );

  const renderSync = () => (
    <Card title="DRC SYNC SYSTEM">
      <View style={styles.syncHero}>
        <Text style={styles.syncIcon}>↻</Text>
        <Text style={styles.syncTitle}>{connected ? 'CONNECTED' : 'READY TO CONNECT'}</Text>
        <Text style={styles.syncText}>Keep Simulator, Radar and Map data together in one Elite Golf session.</Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={() => setConnected(v => !v)}>
        <Text style={styles.primaryButtonText}>{connected ? 'DISCONNECT' : 'CONNECT DRC SYNC'}</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <View style={styles.page}>
        <View style={styles.header}>
          <Image source={require('./content.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.headerText}>
            <Text style={styles.title}>DRC GOLF ELITE</Text>
            <Text style={styles.subtitle}>4-IN-1 PERFORMANCE SYSTEM</Text>
          </View>
          <TouchableOpacity style={styles.unitButton} onPress={() => setMetric(v => !v)}>
            <Text style={styles.unitButtonText}>{unitLabel}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.systemBar}>
          {systems.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[styles.systemButton, system === item.key && styles.systemButtonActive]}
              onPress={() => setSystem(item.key)}
            >
              <Text style={[styles.systemIcon, system === item.key && styles.systemTextActive]}>{item.icon}</Text>
              <Text style={[styles.systemText, system === item.key && styles.systemTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionEyebrow}>ACTIVE SYSTEM</Text>
            <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
          </View>
          {system === 'SIM' && renderSimulator()}
          {system === 'RADAR' && renderRadar()}
          {system === 'MAP' && renderMap()}
          {system === 'SYNC' && renderSync()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function History({ metric }) {
  return (
    <Card title="RECENT RUNS HISTORY">
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.col1]}>SHOT ID</Text>
        <Text style={[styles.th, styles.col2]}>SPEED VALUE</Text>
        <Text style={[styles.th, styles.col3]}>TEMPO RATIO</Text>
      </View>
      {SHOTS.map(item => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={[styles.td, styles.col1]}>{item.id}</Text>
          <Text style={[styles.tdStrong, styles.col2]}>{metric ? `${item.speed} kph` : `${(item.speed * 0.621371).toFixed(1)} mph`}</Text>
          <Text style={[styles.td, styles.col3]}>{item.tempo}</Text>
        </View>
      ))}
    </Card>
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
  headerText: { flex: 1 },
  title: { color: BLUE, fontSize: 19, fontWeight: '900', letterSpacing: 0.7 },
  subtitle: { color: GOLD, fontSize: 8, fontWeight: '900', letterSpacing: 1.1, marginTop: 1 },
  unitButton: { borderWidth: 1, borderColor: BLUE, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 7 },
  unitButtonText: { color: BLUE, fontSize: 8, fontWeight: '900' },

  systemBar: { flexDirection: 'row', padding: 7, gap: 5, backgroundColor: PANEL, borderBottomWidth: 1, borderBottomColor: LINE },
  systemButton: { flex: 1, minHeight: 48, borderRadius: 9, borderWidth: 1, borderColor: LINE, backgroundColor: PAPER, alignItems: 'center', justifyContent: 'center' },
  systemButtonActive: { backgroundColor: BLUE, borderColor: BLUE },
  systemIcon: { color: BLUE, fontSize: 15, fontWeight: '900', lineHeight: 17 },
  systemText: { color: BLUE, fontSize: 8, fontWeight: '900', marginTop: 2 },
  systemTextActive: { color: '#FFFFFF' },

  scroll: { padding: 10, paddingBottom: 20 },
  sectionHeading: { marginBottom: 7 },
  sectionEyebrow: { color: GOLD, fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  sectionTitle: { color: BLUE, fontSize: 18, fontWeight: '900', marginTop: 1 },

  card: { backgroundColor: PAPER, borderWidth: 1, borderColor: LINE, borderRadius: 12, padding: 10, marginBottom: 8 },
  cardTitle: { color: BLUE, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PANEL, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7, marginBottom: 7 },
  statusLabel: { color: MUTED, fontSize: 9, fontWeight: '800' },
  ready: { color: GREEN, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },

  twoCol: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  threeCol: { flexDirection: 'row', gap: 6, marginTop: 7 },
  metricBox: { flex: 1, minHeight: 62, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: LINE, borderRadius: 9, padding: 8, justifyContent: 'center' },
  metricLabel: { color: MUTED, fontSize: 7.5, fontWeight: '900', letterSpacing: 0.8, marginBottom: 4 },
  metricValue: { color: INK, fontSize: 18, fontWeight: '900' },
  metricValueSmall: { fontSize: 14 },

  tableHeader: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: LINE },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E7E1D7' },
  th: { color: MUTED, fontSize: 7.5, fontWeight: '900' },
  td: { color: INK, fontSize: 10, fontWeight: '700' },
  tdStrong: { color: BLUE, fontSize: 10, fontWeight: '900' },
  col1: { width: '25%' },
  col2: { width: '40%', textAlign: 'center' },
  col3: { width: '35%', textAlign: 'right' },

  note: { color: MUTED, fontSize: 9, lineHeight: 14, marginTop: 4 },

  mapBox: { height: 190, borderRadius: 10, backgroundColor: '#DDE3DC', borderWidth: 1, borderColor: LINE, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  flagPole: { position: 'absolute', width: 2, height: 54, backgroundColor: BLUE, top: 44 },
  flag: { position: 'absolute', top: 35, marginLeft: 13, color: BLUE, fontSize: 23 },
  playerDot: { position: 'absolute', bottom: 28, width: 14, height: 14, borderRadius: 7, backgroundColor: GOLD, borderWidth: 2, borderColor: '#FFFFFF' },
  mapText: { color: BLUE2, fontWeight: '900', fontSize: 10, letterSpacing: 1.4 },

  syncHero: { alignItems: 'center', paddingVertical: 16 },
  syncIcon: { color: BLUE, fontSize: 38, fontWeight: '900' },
  syncTitle: { color: BLUE, fontSize: 16, fontWeight: '900', marginTop: 3 },
  syncText: { color: MUTED, textAlign: 'center', fontSize: 9, lineHeight: 14, marginTop: 5, maxWidth: 270 },
  primaryButton: { minHeight: 42, backgroundColor: BLUE, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.9 },
});
