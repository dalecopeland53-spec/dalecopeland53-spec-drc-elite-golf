import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('TRACK');
  const [currentShotNum, setCurrentShotNum] = useState(5);
  const [driverDistance, setDriverDistance] = useState(230);

  // Dynamic 4-View Screen Router Matrix Engine
  const renderActiveViewport = () => {
    switch (activeTab) {
      case 'TRACK': 
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.forceBox}>
              <View style={styles.headerRow}>
                <Text style={styles.headerSubLeft}>PRACTICE{"\n"}WITH{"\n"}PURPOSE</Text>
                <View style={styles.logoCenter}>
                  <Text style={styles.brandText}>DRC</Text>
                  <Text style={styles.brandSub}>ELITE GOLF</Text>
                </View>
                <Text style={styles.headerSubRight}>MEASURE{"\n"}IMPROVE{"\n"}PLAY BETTER</Text>
              </View>

              <View style={styles.topDashboardGrid}>
                <View style={styles.cardSilverCompact}>
                  <Text style={styles.cardLabel}>CLUB</Text>
                  <View style={styles.pickerSelectorBox}><Text style={styles.pickerText}>7 IRON  ▼</Text></View>
                  <Text style={styles.clubGraphicIcon}>🏌️‍♂️</Text>
                </View>
                <View style={styles.cardSilverCompact}>
                  <Text style={styles.cardLabel}>CARRY (m)</Text>
                  <Text style={styles.mainCarryMetric}>152</Text>
                  <View style={styles.subMetricRow}>
                    <View style={styles.subMetricCell}><Text style={styles.subLabel}>TOTAL</Text><Text style={styles.subVal}>159</Text></View>
                    <View style={styles.subMetricCell}><Text style={styles.subLabel}>BALL SPD</Text><Text style={styles.subVal}>112</Text></View>
                    <View style={styles.subMetricCell}><Text style={styles.subLabel}>SMASH</Text><Text style={styles.subVal}>1.42</Text></View>
                  </View>
                </View>
                <View style={styles.cardSilverCompact}>
                  <Text style={styles.cardLabel}>SHOT</Text>
                  <Text style={styles.shotShapeStatusText}>STRAIGHT</Text>
                  <View style={styles.ballNodeMarkerCircle} />
                </View>
              </View>

              <View style={styles.telemetryGridRow}>
                <View style={styles.telemetryMiniCard}><Text style={styles.telLabel}>LAUNCH</Text><Text style={styles.telValue}>17.2°</Text></View>
                <View style={styles.telemetryMiniCard}><Text style={styles.telLabel}>SPIN</Text><Text style={styles.telValue}>6200{"\n"}<Text style={styles.telUnit}>rpm</Text></Text></View>
                <View style={styles.telemetryMiniCard}><Text style={styles.telLabel}>HEIGHT</Text><Text style={styles.telValue}>28 m</Text></View>
                <View style={styles.telemetryMiniCard}><Text style={styles.telLabel}>LAND ANGLE</Text><Text style={styles.telValue}>47.5°</Text></View>
                <View style={styles.telemetryMiniCard}><Text style={styles.telLabel}>CURVE</Text><Text style={styles.telValue}>2R m</Text></View>
              </View>

              <View style={styles.tracerCanvasShellBox}>
                <View style={styles.canvasTextRow}>
                  <Text style={styles.canvasMetricBadge}>152 m CARRY</Text>
                  <Text style={styles.canvasMetricBadge}>159 m TOTAL</Text>
                </View>
                <View style={styles.mockFairwayFlightZone}>
                  <View style={styles.mockFlightArcLineVector} />
                </View>
                <View style={styles.canvasScaleLineRow}>
                  <Text style={styles.scaleText}>50</Text><Text style={styles.scaleText}>100</Text>
                  <Text style={styles.scaleText}>150</Text><Text style={styles.scaleText}>200</Text>
                </View>
              </View>

              <View style={styles.executionActionRow}>
                <TouchableOpacity style={styles.recordBtn}>
                  <Text style={styles.recordBtnText}>RECORD</Text>
                  <View style={styles.recordOuterRing} />
                </TouchableOpacity>
                <View style={styles.shotCycleSelectorCard}>
                  <Text style={styles.cycleLabel}>SHOT {currentShotNum} / 20</Text>
                  <View style={styles.arrowRowButtons}>
                    <TouchableOpacity onPress={() => setCurrentShotNum(Math.max(1, currentShotNum - 1))} style={styles.arrowBox}><Text style={styles.arrowIconText}>◀</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentShotNum(Math.min(20, currentShotNum + 1))} style={styles.arrowBox}><Text style={styles.arrowIconText}>▶</Text></TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>SAVE</Text>
                  <Text style={styles.bookmarkSymbolIcon}>🔖</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.mottoFooterLabel}>DATA DRIVES A BETTER GAME</Text>
            </View>
          </ScrollView>
        );
      case 'HISTORY':
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.forceBox}>
              <View style={styles.profileCard}>
                <Text style={styles.userNameText}>Post-Round Analysis</Text>
                <Text style={styles.caddieLabelText}>Capricorn Resort Summary</Text>
              </View>
              <View style={styles.placeholderCard}><Text style={styles.placeholderCardText}>📊 RANGE SESSION LOG MATRIX HISTOGRAM RUNNING</Text></View>
              <Text style={styles.scriptureSignOffText}>Know Your Numbers</Text>
            </View>
          </ScrollView>
        );
      case 'MYBAG':
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.forceBox}>
              <View style={styles.headerRow}><Text style={styles.brandTitleTextOnly}>DRC INVENTORY</Text></View>
              <View style={styles.driverPanelHubCard}>
                <Text style={styles.panelTitleLabel}>DRIVER DISTANCE CALIBRATION</Text>
                <View style={styles.panelControlRow}>
                  <TouchableOpacity style={styles.largePanelBtn} onPress={() => setDriverDistance(Math.max(0, driverDistance - 5))}><Text style={styles.largePanelBtnText}>−</Text></TouchableOpacity>
                  <View style={styles.panelValueBox}><Text style={styles.panelMainValueText}>{driverDistance} m</Text></View>
                  <TouchableOpacity style={styles.largePanelBtn} onPress={() => setDriverDistance(driverDistance + 5))}><Text style={styles.largePanelBtnText}>+</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.placeholderCard}><Text style={styles.placeholderCardText}>🎒 14-CLUB DYNAMIC BAG ARRAY INITIALISED</Text></View>
            </View>
          </ScrollView>
        );
      case 'MORE':
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.forceBox}>
              <View style={styles.header}><Text style={styles.brandTitleTextOnly}>MORE OPTIONS</Text></View>
              <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.listRowItem} onPress={() => Linking.openURL('geo:-23.1042,150.7311?q=Capricorn+Resort+Golf')}><Text style={styles.rowTitleText}>📍 GET DIRECTIONS</Text><Text style={styles.chevronText}>Yeppoon ▶</Text></TouchableOpacity>
                <TouchableOpacity style={styles.listRowItem} onPress={() => Linking.openURL('tel:0749252621')}><Text style={styles.rowTitleText}>📞 CALL PRO SHOP</Text><Text style={styles.chevronText}>(07) 4925 2621 ▶</Text></TouchableOpacity>
              </View>
              <Text style={styles.buildFooterLabel}>DRC Virtual Golf Elite • Version 1.0</Text>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <View style={styles.viewport}>{renderActiveViewport()}</View>
      <View style={styles.navDock}>
        <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('TRACK')}>
          <Text style={[styles.dockIcon, activeTab === 'TRACK' && styles.activeText]}>🎯</Text>
          <Text style={[styles.dockLabel, activeTab === 'TRACK' && styles.activeText]}>Track</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('HISTORY')}>
          <Text style={[styles.dockIcon, activeTab === 'HISTORY' && styles.activeText]}>📊</Text>
          <Text style={[styles.dockLabel, activeTab === 'HISTORY' && styles.activeText]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('MYBAG')}>
          <Text style={[styles.dockIcon, activeTab === 'MYBAG' && styles.activeText]}>🎒</Text>
          <Text style={[styles.dockLabel, activeTab === 'MYBAG' && styles.activeText]}>My Bag</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('MORE')}>
          <Text style={[styles.dockIcon, activeTab === 'MORE' && styles.activeText]}>⚙️</Text>
          <Text style={[styles.dockLabel, activeTab === 'MORE' && styles.activeText]}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

