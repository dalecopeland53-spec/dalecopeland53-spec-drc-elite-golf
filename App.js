import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

const BLUE = '#0E3153';
const BLUE_2 = '#164D78';
const GOLD = '#B78935';
const BG = '#ECE8DF';
const PAPER = '#F8F5EE';
const PANEL = '#E3DED3';
const LINE = '#C9C1B2';
const INK = '#102A42';
const MUTED = '#6C7680';

const DEFAULT_BAG = [
  ['Driver', 230], ['3 Wood', 210], ['5 Wood', 195], ['4 Iron', 180],
  ['5 Iron', 170], ['6 Iron', 160], ['7 Iron', 150], ['8 Iron', 140],
  ['9 Iron', 130], ['PW', 115], ['GW', 100], ['SW', 85], ['LW', 70], ['Putter', 0],
];

function SmallBrand() {
  return (
    <View style={styles.brandBar}>
      <Image source={require('./content.png')} style={styles.brandIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.brandTitle}>DRC ELITE GOLF</Text>
        <Text style={styles.brandTag}>PLAY • PRACTICE • IMPROVE</Text>
      </View>
    </View>
  );
}

function Card({ title, children, style }) {
  return (
    <View style={[styles.card, style]}>
      {!!title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );
}

function NavButton({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [tab, setTab] = useState('TRACK');
  const [shot, setShot] = useState(1);
  const [club, setClub] = useState('7 Iron');
  const [carry, setCarry] = useState('150');
  const [shape, setShape] = useState('STRAIGHT');
  const [result, setResult] = useState('GOOD');
  const [bag, setBag] = useState(DEFAULT_BAG);
  const [history, setHistory] = useState([]);

  const avgCarry = useMemo(() => {
    if (!history.length) return 0;
    return Math.round(history.reduce((sum, item) => sum + Number(item.carry || 0), 0) / history.length);
  }, [history]);

  const saveShot = () => {
    const distance = Math.max(0, Number(carry) || 0);
    setHistory(prev => [
      { id: Date.now().toString(), shot, club, carry: distance, shape, result },
      ...prev,
    ]);
    setShot(prev => prev + 1);
  };

  const adjustBag = (index, delta) => {
    setBag(prev => prev.map((item, i) => {
      if (i !== index || item[0] === 'Putter') return item;
      return [item[0], Math.max(0, item[1] + delta)];
    }));
  };

  const renderTrack = () => (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <SmallBrand />

      <View style={styles.heroStrip}>
        <View>
          <Text style={styles.heroEyebrow}>PRACTICE WITH PURPOSE</Text>
          <Text style={styles.heroMain}>SHOT {shot}</Text>
        </View>
        <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>ELITE SESSION</Text></View>
      </View>

      <View style={styles.threeGrid}>
        <Card style={styles.thirdCard} title="CLUB">
          <Text style={styles.bigMetric}>{club}</Text>
        </Card>
        <Card style={styles.thirdCard} title="CARRY">
          <Text style={styles.bigMetric}>{carry || '0'} m</Text>
        </Card>
        <Card style={styles.thirdCard} title="SHOT">
          <Text style={styles.bigMetricSmall}>{shape}</Text>
        </Card>
      </View>

      <Card title="ENTER SHOT">
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Club</Text>
          <View style={styles.segmentRow}>
            {['7 Iron', 'PW', 'Driver'].map(name => (
              <TouchableOpacity key={name} onPress={() => setClub(name)} style={[styles.segment, club === name && styles.segmentActive]}>
                <Text style={[styles.segmentText, club === name && styles.segmentTextActive]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Carry</Text>
          <TextInput
            value={carry}
            onChangeText={setCarry}
            keyboardType="number-pad"
            maxLength={3}
            style={styles.distanceInput}
          />
          <Text style={styles.unit}>m</Text>
        </View>

        <Text style={styles.labelTop}>Shape</Text>
        <View style={styles.segmentRowWide}>
          {['DRAW', 'STRAIGHT', 'FADE'].map(name => (
            <TouchableOpacity key={name} onPress={() => setShape(name)} style={[styles.segmentWide, shape === name && styles.segmentActive]}>
              <Text style={[styles.segmentText, shape === name && styles.segmentTextActive]}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.labelTop}>Result</Text>
        <View style={styles.segmentRowWide}>
          {['LEFT', 'GOOD', 'RIGHT'].map(name => (
            <TouchableOpacity key={name} onPress={() => setResult(name)} style={[styles.segmentWide, result === name && styles.segmentActive]}>
              <Text style={[styles.segmentText, result === name && styles.segmentTextActive]}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={saveShot} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>SAVE SHOT</Text>
        </TouchableOpacity>
      </Card>

      <Card title="SESSION SNAPSHOT">
        <View style={styles.metricRow}>
          <View style={styles.metricBox}><Text style={styles.metricValue}>{history.length}</Text><Text style={styles.metricLabel}>SHOTS</Text></View>
          <View style={styles.metricBox}><Text style={styles.metricValue}>{avgCarry}</Text><Text style={styles.metricLabel}>AVG CARRY</Text></View>
          <View style={styles.metricBox}><Text style={styles.metricValue}>{result}</Text><Text style={styles.metricLabel}>LAST RESULT</Text></View>
        </View>
      </Card>
    </ScrollView>
  );

  const renderHistory = () => (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <SmallBrand />
      <Card title="SHOT HISTORY">
        {!history.length ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>NO SHOTS SAVED YET</Text>
            <Text style={styles.emptyText}>Record a few shots and your session history will appear here.</Text>
          </View>
        ) : history.map(item => (
          <View key={item.id} style={styles.historyRow}>
            <View style={styles.shotBubble}><Text style={styles.shotBubbleText}>{item.shot}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyClub}>{item.club}</Text>
              <Text style={styles.historySub}>{item.shape} • {item.result}</Text>
            </View>
            <Text style={styles.historyCarry}>{item.carry} m</Text>
          </View>
        ))}
      </Card>
      {!!history.length && (
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setHistory([])}>
          <Text style={styles.secondaryButtonText}>CLEAR SESSION</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderBag = () => (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <SmallBrand />
      <Card title="MY BAG • 14 CLUBS">
        {bag.map((item, index) => (
          <View key={item[0]} style={styles.bagRow}>
            <Text style={styles.bagClub}>{item[0]}</Text>
            <TouchableOpacity style={styles.stepButton} onPress={() => adjustBag(index, -5)} disabled={item[0] === 'Putter'}>
              <Text style={styles.stepText}>−</Text>
            </TouchableOpacity>
            <View style={styles.bagDistanceBox}><Text style={styles.bagDistance}>{item[1]} m</Text></View>
            <TouchableOpacity style={styles.stepButton} onPress={() => adjustBag(index, 5)} disabled={item[0] === 'Putter'}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    </ScrollView>
  );

  const renderMore = () => (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <SmallBrand />
      <Card title="ELITE GOLF">
        <View style={styles.infoRow}><Text style={styles.infoLabel}>APP</Text><Text style={styles.infoValue}>DRC Elite Golf</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>VERSION</Text><Text style={styles.infoValue}>1.0.0</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>MODE</Text><Text style={styles.infoValue}>Standalone</Text></View>
      </Card>
      <Card title="QUICK GUIDE">
        <Text style={styles.guideText}>1. Set your club and carry distance.</Text>
        <Text style={styles.guideText}>2. Choose shot shape and result.</Text>
        <Text style={styles.guideText}>3. Save every shot you want to analyse.</Text>
        <Text style={styles.guideText}>4. Use History to review the session.</Text>
        <Text style={styles.guideText}>5. Keep My Bag distances current.</Text>
      </Card>
      <View style={styles.logoPanel}>
        <Image source={require('./content.png')} style={styles.logoPanelImage} resizeMode="contain" />
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <View style={styles.page}>
        <View style={styles.content}>
          {tab === 'TRACK' && renderTrack()}
          {tab === 'HISTORY' && renderHistory()}
          {tab === 'BAG' && renderBag()}
          {tab === 'MORE' && renderMore()}
        </View>

        <View style={styles.navDock}>
          <NavButton label="Track" icon="◉" active={tab === 'TRACK'} onPress={() => setTab('TRACK')} />
          <NavButton label="History" icon="▥" active={tab === 'HISTORY'} onPress={() => setTab('HISTORY')} />
          <NavButton label="My Bag" icon="♢" active={tab === 'BAG'} onPress={() => setTab('BAG')} />
          <NavButton label="More" icon="•••" active={tab === 'MORE'} onPress={() => setTab('MORE')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  page: { flex: 1, backgroundColor: BG },
  content: { flex: 1 },
  scroll: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 14 },

  brandBar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  brandIcon: { width: 48, height: 48, borderRadius: 11, marginRight: 10 },
  brandTitle: { color: BLUE, fontSize: 20, fontWeight: '900', letterSpacing: 0.8 },
  brandTag: { color: GOLD, fontSize: 8.5, fontWeight: '900', letterSpacing: 1.2, marginTop: 2 },

  heroStrip: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroEyebrow: { color: '#D9C8A2', fontSize: 8.5, fontWeight: '900', letterSpacing: 1.2 },
  heroMain: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 1 },
  liveBadge: { borderWidth: 1, borderColor: GOLD, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  liveBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },

  threeGrid: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  thirdCard: { flex: 1, marginBottom: 0, minHeight: 76 },
  card: {
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  cardTitle: { color: BLUE, fontSize: 9, fontWeight: '900', letterSpacing: 1.1, marginBottom: 7 },
  bigMetric: { color: INK, fontSize: 16, fontWeight: '900' },
  bigMetricSmall: { color: INK, fontSize: 11, fontWeight: '900' },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { width: 44, color: MUTED, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  labelTop: { color: MUTED, fontSize: 9, fontWeight: '900', textTransform: 'uppercase', marginTop: 3, marginBottom: 5 },
  segmentRow: { flex: 1, flexDirection: 'row', gap: 5 },
  segmentRowWide: { flexDirection: 'row', gap: 5, marginBottom: 7 },
  segment: { flex: 1, minHeight: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: PANEL, borderRadius: 8, borderWidth: 1, borderColor: LINE },
  segmentWide: { flex: 1, minHeight: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: PANEL, borderRadius: 8, borderWidth: 1, borderColor: LINE },
  segmentActive: { backgroundColor: BLUE, borderColor: BLUE },
  segmentText: { color: INK, fontSize: 8.5, fontWeight: '900' },
  segmentTextActive: { color: '#FFFFFF' },

  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  distanceInput: { flex: 1, height: 36, borderWidth: 1, borderColor: LINE, borderRadius: 8, backgroundColor: '#FFFFFF', paddingHorizontal: 10, color: BLUE, fontSize: 16, fontWeight: '900', textAlign: 'center' },
  unit: { width: 24, marginLeft: 5, color: MUTED, fontSize: 10, fontWeight: '900' },

  primaryButton: { height: 40, borderRadius: 9, backgroundColor: BLUE, borderWidth: 1, borderColor: GOLD, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  secondaryButton: { height: 38, borderRadius: 9, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  secondaryButtonText: { color: BLUE, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },

  metricRow: { flexDirection: 'row', gap: 6 },
  metricBox: { flex: 1, minHeight: 58, borderRadius: 9, backgroundColor: PANEL, alignItems: 'center', justifyContent: 'center', padding: 5 },
  metricValue: { color: BLUE, fontSize: 15, fontWeight: '900', textAlign: 'center' },
  metricLabel: { color: MUTED, fontSize: 7.5, fontWeight: '900', marginTop: 3, textAlign: 'center' },

  emptyBox: { paddingVertical: 20, alignItems: 'center' },
  emptyTitle: { color: BLUE, fontWeight: '900', fontSize: 11, letterSpacing: 0.7 },
  emptyText: { color: MUTED, textAlign: 'center', marginTop: 6, fontSize: 10, lineHeight: 15, maxWidth: 260 },
  historyRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: LINE, paddingVertical: 7 },
  shotBubble: { width: 30, height: 30, borderRadius: 15, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  shotBubbleText: { color: '#FFFFFF', fontWeight: '900', fontSize: 10 },
  historyClub: { color: INK, fontSize: 11, fontWeight: '900' },
  historySub: { color: MUTED, fontSize: 8.5, fontWeight: '700', marginTop: 2 },
  historyCarry: { color: BLUE, fontSize: 14, fontWeight: '900' },

  bagRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: LINE, paddingVertical: 4 },
  bagClub: { flex: 1, color: INK, fontSize: 10, fontWeight: '900' },
  stepButton: { width: 34, height: 30, borderRadius: 7, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  stepText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', lineHeight: 20 },
  bagDistanceBox: { width: 76, height: 30, marginHorizontal: 5, borderRadius: 7, backgroundColor: PANEL, alignItems: 'center', justifyContent: 'center' },
  bagDistance: { color: BLUE, fontSize: 11, fontWeight: '900' },

  infoRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: LINE },
  infoLabel: { width: 80, color: MUTED, fontSize: 8, fontWeight: '900' },
  infoValue: { flex: 1, color: INK, fontSize: 10, fontWeight: '900', textAlign: 'right' },
  guideText: { color: INK, fontSize: 10, lineHeight: 19, fontWeight: '700' },
  logoPanel: { height: 210, borderRadius: 12, overflow: 'hidden', backgroundColor: '#091C18', borderWidth: 1, borderColor: GOLD, marginBottom: 10 },
  logoPanelImage: { width: '100%', height: '100%' },

  navDock: { height: 64, flexDirection: 'row', backgroundColor: '#F8F5EE', borderTopWidth: 1, borderTopColor: LINE, paddingBottom: 3 },
  navButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: MUTED, fontSize: 18, fontWeight: '900', lineHeight: 20 },
  navLabel: { color: MUTED, fontSize: 8.5, fontWeight: '900', marginTop: 2 },
  navActive: { color: BLUE },
});
