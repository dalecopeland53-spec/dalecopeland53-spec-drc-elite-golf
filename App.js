import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, Pressable, View, Image, ScrollView, useWindowDimensions, TextInput, Platform } from 'react-native';
import * as Location from 'expo-location';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

const C={blue:'#0E3153',gold:'#B78935',bg:'#ECE8DF',paper:'#F8F5EE',panel:'#E3DED3',line:'#C9C1B2',muted:'#6C7680',ink:'#102A42',green:'#2F6B4F',red:'#9B3A34',white:'#FFFFFF'};
const systems=[
  {id:'VIRTUAL',title:'DRC Virtual Golf',sub:'Session and shot capture',icon:'◉'},
  {id:'LAUNCH',title:'DRC Launch Monitor',sub:'Measured speed and strike',icon:'⌁'},
  {id:'GPS',title:'DRC GPS',sub:'Live GPS and course marking',icon:'◇'},
  {id:'CONNECT',title:'DRC Connect',sub:'Shared DRC session data',icon:'↻'}
];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return Number.isFinite(n)?n:null;};

function Header({title,home,metric,toggleUnits,ui}){
  return <View style={[s.header,{minHeight:ui.header}]}>
    <View style={s.headerSide}>{home?<Pressable onPress={home} hitSlop={10} style={({pressed})=>[s.homeButton,pressed&&s.pressed]}><Text style={s.homeButtonText}>‹ HOME</Text></Pressable>:<Image source={require('./content.png')} style={[s.logo,{width:ui.logo,height:ui.logo}]} resizeMode="contain"/>}</View>
    <View style={s.headerText}><Text numberOfLines={1} adjustsFontSizeToFit style={[s.brand,{fontSize:ui.brand}]}>{title||'DRC GOLF ELITE'}</Text><Text numberOfLines={1} style={s.tag}>{home?'DRC ELITE GOLF':'4-IN-1 PERFORMANCE SYSTEM'}</Text></View>
    <View style={[s.headerSide,{alignItems:'flex-end'}]}><Pressable onPress={toggleUnits} hitSlop={8} style={({pressed})=>[s.unitButton,pressed&&s.pressed]}><Text style={s.unitText}>{metric?'METRIC':'IMPERIAL'}</Text></Pressable></View>
  </View>
}
function Panel({title,children,compact=false}){return <View style={[s.panel,compact&&s.panelCompact]}><Text style={[s.panelTitle,compact&&s.panelTitleCompact]}>{title}</Text>{children}</View>}
function Metric({label,value,ui}){return <View style={[s.metricBox,{minHeight:ui.metric}]}><Text style={s.metricLabel}>{label}</Text><Text style={[s.metricValue,{fontSize:ui.metricText}]}>{value}</Text></View>}
function Button({label,onPress,secondary=false,disabled=false,small=false}){return <Pressable disabled={disabled} onPress={onPress} style={({pressed})=>[s.primaryButton,secondary&&s.secondaryButton,small&&s.smallButton,disabled&&s.disabled,pressed&&s.pressed]}><Text style={[s.primaryButtonText,secondary&&s.secondaryButtonText,small&&s.smallButtonText]}>{label}</Text></Pressable>}
function Field({label,value,onChange,placeholder}){return <View style={s.fieldWrap}><Text style={s.metricLabel}>{label}</Text><TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9AA1A7" keyboardType="decimal-pad" style={s.field}/></View>}

function VoiceControl({onCommand}){
  const [listening,setListening]=useState(false); const [heard,setHeard]=useState('Tap mic for DRC Voice');
  useSpeechRecognitionEvent('start',()=>setListening(true));
  useSpeechRecognitionEvent('end',()=>setListening(false));
  useSpeechRecognitionEvent('error',e=>{setListening(false);setHeard(e?.message||'Voice unavailable');});
  useSpeechRecognitionEvent('result',e=>{const text=e?.results?.[0]?.transcript?.trim();if(text){setHeard(`Heard: ${text}`);onCommand?.(text);}});
  const toggle=async()=>{if(listening){ExpoSpeechRecognitionModule.stop();return;}const p=await ExpoSpeechRecognitionModule.requestPermissionsAsync();if(!p.granted){setHeard('Microphone permission denied');return;}ExpoSpeechRecognitionModule.start({lang:'en-AU',interimResults:false,continuous:false,maxAlternatives:1});};
  return <View style={s.voiceRow}><Pressable onPress={toggle} style={({pressed})=>[s.micButton,listening&&s.micActive,pressed&&s.pressed]}><Text style={s.micText}>{listening?'■':'🎙'}</Text></Pressable><View style={s.voiceTextWrap}><Text style={s.voiceTitle}>DRC VOICE</Text><Text numberOfLines={1} style={s.voiceText}>{listening?'Listening…':heard}</Text></View></View>;
}

function Home({open,metric,toggleUnits,ui,onVoice}){
  return <View style={s.screen}><Header metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.homeScroll} showsVerticalScrollIndicator={false}>
    <View style={[s.hero,{padding:ui.pad}]}><Text style={s.heroSmall}>DRC ELITE GOLF</Text><Text style={[s.heroTitle,{fontSize:ui.title}]}>SELECT A SYSTEM</Text><Text style={s.heroText}>One shared session. Live controls. No fabricated readings.</Text></View>
    <VoiceControl onCommand={onVoice}/>
    <View style={s.grid}>{systems.map(item=><Pressable key={item.id} onPress={()=>open(item.id)} style={({pressed})=>[s.launchCard,{height:ui.card,padding:ui.pad},pressed&&s.pressed]}><Text style={[s.icon,{fontSize:ui.icon}]}>{item.icon}</Text><Text style={[s.cardTitle,{fontSize:ui.cardTitle}]}>{item.title}</Text><Text style={s.cardSub}>{item.sub}</Text><View style={s.openBadge}><Text style={s.openText}>OPEN</Text></View></Pressable>)}</View>
  </ScrollView></View>
}

function VirtualGolf({home,metric,toggleUnits,ui,shots,clearShots,onVoice}){
  const [running,setRunning]=useState(false); const latest=shots[0]||null;
  const distance=latest?.carry==null?'—':metric?`${latest.carry.toFixed(1)} m`:`${(latest.carry*1.09361).toFixed(1)} yd`;
  return <View style={s.screen}><Header title="DRC VIRTUAL GOLF" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <VoiceControl onCommand={onVoice}/>
    <Panel title="SESSION"><View style={s.statusRow}><Text style={s.statusLabel}>Session Status</Text><Text style={running?s.ready:s.standby}>{running?'ACTIVE':'STANDBY'}</Text></View>
      <View style={s.row}><Metric ui={ui} label="SHOTS" value={String(shots.length)}/><Metric ui={ui} label="LAST CARRY" value={distance}/></View>
      <Text style={s.note}>Virtual Golf uses verified measurements received through DRC Connect from the Launch Monitor.</Text>
      <Button label={running?'STOP SESSION':'START SESSION'} onPress={()=>setRunning(v=>!v)}/>
    </Panel>
    <Panel title="SHOT LOG">{shots.length===0?<Text style={s.empty}>No measured shots recorded.</Text>:shots.slice(0,8).map((x,i)=><View key={x.id} style={s.shotLine}><View><Text style={s.statusName}>SHOT {shots.length-i}</Text><Text style={s.shotSub}>{x.source}</Text></View><View style={{alignItems:'flex-end'}}><Text style={s.ready}>{metric?`${x.clubSpeed.toFixed(1)} kph`:`${(x.clubSpeed*0.621371).toFixed(1)} mph`}</Text><Text style={s.shotSub}>{x.carry==null?'NO CARRY':metric?`${x.carry.toFixed(1)} m`:`${(x.carry*1.09361).toFixed(1)} yd`}</Text></View></View>)}{shots.length>0&&<Button label="CLEAR SHOT LOG" secondary onPress={clearShots}/>}</Panel>
  </ScrollView></View>
}

function LaunchMonitor({home,metric,toggleUnits,ui,onMeasurement,lastShot,onVoice}){
  const [armed,setArmed]=useState(false); const [club,setClub]=useState(''); const [ball,setBall]=useState(''); const [tempo,setTempo]=useState(''); const [carry,setCarry]=useState('');
  const c=num(club),b=num(ball),t=num(tempo),d=num(carry); const smash=c&&b?b/c:null; const valid=armed&&c>0&&b>0;
  const save=()=>{if(!valid)return;onMeasurement({clubSpeed:metric?c:c/0.621371,ballSpeed:metric?b:b/0.621371,tempo:t,carry:d==null?null:(metric?d:d/1.09361),source:'DRC LAUNCH MONITOR'});setClub('');setBall('');setTempo('');setCarry('');};
  const speed=v=>v==null?'—':metric?`${v.toFixed(1)} kph`:`${(v*0.621371).toFixed(1)} mph`;
  return <View style={s.screen}><Header title="DRC LAUNCH MONITOR" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <VoiceControl onCommand={onVoice}/>
    <Panel title="LAUNCH MONITOR LIVE" compact><View style={s.statusRow}><Text style={s.statusLabel}>Tracking Status</Text><Text style={armed?s.ready:s.standby}>{armed?'ARMED':'STANDBY'}</Text></View>
      <View style={s.row}><Metric ui={ui} label="CLUB SPEED" value={speed(lastShot?.clubSpeed)}/><Metric ui={ui} label="BALL SPEED" value={speed(lastShot?.ballSpeed)}/></View>
      <View style={s.row}><Metric ui={ui} label="SMASH" value={lastShot?.smash?lastShot.smash.toFixed(2):'—'}/><Metric ui={ui} label="TEMPO" value={lastShot?.tempo?`${lastShot.tempo.toFixed(2)} : 1`:'—'}/></View>
      <Text style={s.note}>Arm the Launch Monitor, enter verified readings, then save. DRC Connect shares the same shot with Virtual Golf.</Text>
      <Button label={armed?'DISARM LAUNCH MONITOR':'ARM LAUNCH MONITOR'} onPress={()=>setArmed(v=>!v)}/>
    </Panel>
    <Panel title="MEASUREMENT INTAKE" compact><View style={s.row}><Field label={`CLUB SPEED (${metric?'KPH':'MPH'})`} value={club} onChange={setClub} placeholder="0.0"/><Field label={`BALL SPEED (${metric?'KPH':'MPH'})`} value={ball} onChange={setBall} placeholder="0.0"/></View><View style={s.row}><Field label="TEMPO RATIO" value={tempo} onChange={setTempo} placeholder="3.0"/><Field label={`CARRY (${metric?'M':'YD'})`} value={carry} onChange={setCarry} placeholder="optional"/></View>
      <View style={s.calcBox}><Text style={s.statusLabel}>CALCULATED SMASH</Text><Text style={s.calcValue}>{smash?smash.toFixed(2):'—'}</Text></View>
      <Button label="SAVE VERIFIED MEASUREMENT" disabled={!valid} onPress={save}/><Text style={s.fine}>DRC does not invent club or ball speed. Saved measurements are shared through DRC Connect.</Text>
    </Panel>
  </ScrollView></View>
}

function GPSScreen({home,metric,toggleUnits,ui,onGpsState,onMark,marks,onVoice}){
  const [status,setStatus]=useState('READY'); const [position,setPosition]=useState(null); const [watching,setWatching]=useState(false); const watcher=useRef(null);
  const stopWatch=()=>{if(watcher.current){watcher.current.remove();watcher.current=null;}setWatching(false);};
  useEffect(()=>()=>stopWatch(),[]); useEffect(()=>{onGpsState?.({status,position,watching});},[status,position,watching]);
  const getPosition=async()=>{try{setStatus('REQUESTING PERMISSION');const {status:permission}=await Location.requestForegroundPermissionsAsync();if(permission!=='granted'){setStatus('PERMISSION DENIED');return;}setStatus('LOCATING');const p=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});setPosition(p.coords);setStatus('GPS LOCKED');}catch(e){setStatus('GPS ERROR');}};
  const toggleLive=async()=>{if(watching){stopWatch();setStatus(position?'GPS LOCKED':'READY');return;}try{const {status:permission}=await Location.requestForegroundPermissionsAsync();if(permission!=='granted'){setStatus('PERMISSION DENIED');return;}setStatus('TRACKING');watcher.current=await Location.watchPositionAsync({accuracy:Location.Accuracy.High,distanceInterval:2,timeInterval:2000},p=>setPosition(p.coords));setWatching(true);}catch(e){setStatus('GPS ERROR');}};
  const mark=type=>{if(position)onMark(type,position);else setStatus('GET GPS FIRST');};
  const speed=position&&typeof position.speed==='number'&&position.speed>=0?position.speed:null; const speedText=speed==null?'—':metric?`${(speed*3.6).toFixed(1)} kph`:`${(speed*2.23694).toFixed(1)} mph`; const accuracy=position?.accuracy?`${Math.round(position.accuracy)} m`:'—';
  return <View style={s.screen}><Header title="DRC GPS" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <VoiceControl onCommand={onVoice}/>
    <Panel title="LIVE PHONE GPS"><View style={s.statusRow}><Text style={s.statusLabel}>GPS Status</Text><Text style={(status==='GPS LOCKED'||status==='TRACKING')?s.ready:status.includes('ERROR')||status.includes('DENIED')?s.error:s.standby}>{status}</Text></View>
      <View style={[s.mapBox,{height:ui.map}]}><Text style={s.flag}>⌖</Text><Text style={s.coord}>{position?position.latitude.toFixed(6):'—'}</Text><Text style={s.coord}>{position?position.longitude.toFixed(6):'—'}</Text></View>
      <View style={s.row}><Metric ui={ui} label="ACCURACY" value={accuracy}/><Metric ui={ui} label="DEVICE SPEED" value={speedText}/></View>
      <Button label="GET GPS POSITION" onPress={getPosition}/><Button label={watching?'STOP LIVE GPS':'START LIVE GPS'} secondary onPress={toggleLive}/>
    </Panel>
    <Panel title="MARK COURSE POSITION" compact><Text style={s.note}>Stand at the point and tap the correct marker. DRC Connect stores the coordinate for the shared session.</Text><View style={s.markGrid}><Button small label="MARK TEE" onPress={()=>mark('TEE')}/><Button small label="MARK FRONT" onPress={()=>mark('FRONT')}/><Button small label="MARK CENTRE" onPress={()=>mark('CENTRE')}/><Button small label="MARK BACK" onPress={()=>mark('BACK')}/><Button small label="MARK HAZARD" onPress={()=>mark('HAZARD')}/></View><Text style={s.fine}>{marks.length?`${marks.length} POSITION${marks.length===1?'':'S'} SAVED`:'NO COURSE POSITIONS SAVED'}</Text></Panel>
  </ScrollView></View>
}

function Connect({home,metric,toggleUnits,ui,shots,gpsState,marks,connected,setConnected,onVoice}){
  const latest=shots[0]; const gpsLive=gpsState?.status==='GPS LOCKED'||gpsState?.status==='TRACKING';
  return <View style={s.screen}><Header title="DRC CONNECT" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <VoiceControl onCommand={onVoice}/>
    <Panel title="DRC CONNECT"><View style={s.syncHero}><Text style={s.syncIcon}>↻</Text><Text style={s.syncTitle}>{connected?'SYSTEMS LINKED':'READY TO LINK'}</Text><Text style={s.syncText}>One shared handshake carries verified Launch Monitor shots, Virtual Golf session data and GPS course positions.</Text></View><Button label={connected?'DISCONNECT DRC SYSTEMS':'CONNECT DRC SYSTEMS'} onPress={()=>setConnected(v=>!v)}/></Panel>
    <Panel title="SYSTEM STATUS"><View style={s.statusLine}><Text style={s.statusName}>VIRTUAL GOLF</Text><Text style={shots.length?s.ready:s.standby}>{shots.length?`${shots.length} SHOT${shots.length===1?'':'S'}`:'NO DATA'}</Text></View><View style={s.statusLine}><Text style={s.statusName}>LAUNCH MONITOR</Text><Text style={latest?s.ready:s.standby}>{latest?'MEASUREMENT READY':'NO DATA'}</Text></View><View style={s.statusLine}><Text style={s.statusName}>GPS</Text><Text style={gpsLive?s.ready:s.standby}>{gpsLive?'GPS LIVE':'STANDBY'}</Text></View><View style={s.statusLine}><Text style={s.statusName}>COURSE MARKS</Text><Text style={marks.length?s.ready:s.standby}>{marks.length?`${marks.length} SAVED`:'NONE'}</Text></View></Panel>
  </ScrollView></View>
}

export default function App(){
  const[screen,setScreen]=useState('HOME'); const[metric,setMetric]=useState(true); const[shots,setShots]=useState([]); const[gpsState,setGpsState]=useState({status:'READY',position:null,watching:false}); const[marks,setMarks]=useState([]); const[connected,setConnected]=useState(true); const{width,height}=useWindowDimensions();
  const bottomSafe=Platform.OS==='android'?clamp(height*.055,44,56):0;
  const ui=useMemo(()=>({header:clamp(height*.071,58,68),logo:clamp(width*.10,38,46),brand:clamp(width*.041,15,18),title:clamp(width*.058,21,27),card:clamp(height*.175,126,154),pad:clamp(width*.03,10,14),icon:clamp(width*.07,25,31),cardTitle:clamp(width*.035,13,16),metric:clamp(height*.07,56,68),metricText:clamp(width*.037,14,17),map:clamp(height*.18,130,170)}),[width,height]);
  const addMeasurement=m=>{const shot={...m,id:Date.now(),smash:m.clubSpeed>0?m.ballSpeed/m.clubSpeed:null,linked:connected};setShots(v=>[shot,...v].slice(0,50));};
  const addMark=(type,coords)=>setMarks(v=>[{id:Date.now(),type,latitude:coords.latitude,longitude:coords.longitude,accuracy:coords.accuracy,linked:connected},...v].slice(0,100));
  const home=()=>setScreen('HOME'); const toggleUnits=()=>setMetric(v=>!v);
  const voiceCommand=text=>{const q=text.toLowerCase();if(q.includes('launch')||q.includes('monitor'))setScreen('LAUNCH');else if(q.includes('virtual')||q.includes('simulator'))setScreen('VIRTUAL');else if(q.includes('gps')||q.includes('map'))setScreen('GPS');else if(q.includes('connect')||q.includes('sync'))setScreen('CONNECT');else if(q.includes('home'))setScreen('HOME');};
  return <SafeAreaView style={[s.safe,{paddingBottom:bottomSafe}]}><StatusBar barStyle="dark-content" backgroundColor={C.bg}/>{screen==='HOME'&&<Home open={setScreen} metric={metric} toggleUnits={toggleUnits} ui={ui} onVoice={voiceCommand}/>} {screen==='VIRTUAL'&&<VirtualGolf home={home} metric={metric} toggleUnits={toggleUnits} ui={ui} shots={shots} clearShots={()=>setShots([])} onVoice={voiceCommand}/>} {screen==='LAUNCH'&&<LaunchMonitor home={home} metric={metric} toggleUnits={toggleUnits} ui={ui} onMeasurement={addMeasurement} lastShot={shots[0]} onVoice={voiceCommand}/>} {screen==='GPS'&&<GPSScreen home={home} metric={metric} toggleUnits={toggleUnits} ui={ui} onGpsState={setGpsState} onMark={addMark} marks={marks} onVoice={voiceCommand}/>} {screen==='CONNECT'&&<Connect home={home} metric={metric} toggleUnits={toggleUnits} ui={ui} shots={shots} gpsState={gpsState} marks={marks} connected={connected} setConnected={setConnected} onVoice={voiceCommand}/>}</SafeAreaView>
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg,paddingTop:StatusBar.currentHeight||0},screen:{flex:1,backgroundColor:C.bg},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:8,borderBottomWidth:1,borderBottomColor:C.line,backgroundColor:C.paper},headerSide:{width:72,justifyContent:'center'},logo:{alignSelf:'flex-start'},headerText:{flex:1,alignItems:'center',paddingHorizontal:4},brand:{color:C.blue,fontWeight:'900',textAlign:'center'},tag:{color:C.gold,fontSize:7,fontWeight:'900',letterSpacing:.7,marginTop:2,textAlign:'center'},unitButton:{borderWidth:1,borderColor:C.blue,borderRadius:8,paddingHorizontal:7,paddingVertical:7},unitText:{color:C.blue,fontSize:8,fontWeight:'900'},homeButton:{borderWidth:1,borderColor:C.blue,borderRadius:8,paddingHorizontal:7,paddingVertical:8,alignSelf:'flex-start'},homeButtonText:{color:C.blue,fontSize:9,fontWeight:'900'},homeScroll:{paddingBottom:18},hero:{margin:10,marginBottom:8,borderRadius:12,backgroundColor:C.blue},heroSmall:{color:'#D9C8A2',fontSize:8,fontWeight:'900',letterSpacing:1.2},heroTitle:{color:C.white,fontWeight:'900',marginTop:2},heroText:{color:'#E8EEF4',fontSize:10,marginTop:3},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',paddingHorizontal:10},launchCard:{width:'48.7%',backgroundColor:C.paper,borderWidth:1,borderColor:C.line,borderRadius:12,marginBottom:9,overflow:'hidden'},pressed:{opacity:.65},icon:{color:C.blue,fontWeight:'900'},cardTitle:{color:C.blue,fontWeight:'900',marginTop:5},cardSub:{color:C.muted,fontSize:9,marginTop:3},openBadge:{marginTop:'auto',alignSelf:'flex-start',backgroundColor:C.blue,borderRadius:20,paddingHorizontal:11,paddingVertical:5},openText:{color:C.white,fontSize:8,fontWeight:'900'},scroll:{padding:10,paddingBottom:18},panel:{backgroundColor:C.paper,borderWidth:1,borderColor:C.line,borderRadius:12,padding:10,marginBottom:8},panelCompact:{padding:8},panelTitle:{color:C.blue,fontSize:10,fontWeight:'900',letterSpacing:1,marginBottom:8},panelTitleCompact:{marginBottom:6},statusRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:C.panel,borderRadius:8,paddingHorizontal:9,paddingVertical:7,marginBottom:7},statusLabel:{color:C.muted,fontSize:9,fontWeight:'800'},ready:{color:C.green,fontSize:9,fontWeight:'900'},standby:{color:C.gold,fontSize:9,fontWeight:'900'},error:{color:C.red,fontSize:9,fontWeight:'900'},row:{flexDirection:'row',gap:6,marginBottom:6},metricBox:{flex:1,backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:9,padding:8,justifyContent:'center'},metricLabel:{color:C.muted,fontSize:7.5,fontWeight:'900',letterSpacing:.7,marginBottom:4},metricValue:{color:C.ink,fontWeight:'900'},note:{color:C.muted,fontSize:10,lineHeight:15,marginTop:2,marginBottom:8},fine:{color:C.muted,fontSize:8,lineHeight:12,marginTop:6},empty:{color:C.muted,fontSize:10,paddingVertical:10},mapBox:{borderRadius:10,backgroundColor:'#DDE3DC',borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginBottom:6},flag:{color:C.blue,fontSize:30,fontWeight:'900'},coord:{color:C.ink,fontSize:12,fontWeight:'800',marginTop:3},primaryButton:{backgroundColor:C.blue,borderRadius:9,paddingVertical:11,paddingHorizontal:10,alignItems:'center',justifyContent:'center',marginTop:6},secondaryButton:{backgroundColor:C.paper,borderWidth:1,borderColor:C.blue},primaryButtonText:{color:C.white,fontSize:10,fontWeight:'900',letterSpacing:.6},secondaryButtonText:{color:C.blue},smallButton:{flexGrow:1,minWidth:'31%',paddingVertical:8,marginTop:0},smallButtonText:{fontSize:8},disabled:{opacity:.35},statusLine:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:9,borderBottomWidth:1,borderBottomColor:C.line},shotLine:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.line},statusName:{color:C.blue,fontSize:9,fontWeight:'900'},shotSub:{color:C.muted,fontSize:8,marginTop:2},syncHero:{alignItems:'center',paddingVertical:8},syncIcon:{fontSize:34,color:C.blue,fontWeight:'900'},syncTitle:{color:C.blue,fontSize:16,fontWeight:'900',marginTop:3},syncText:{color:C.muted,fontSize:10,textAlign:'center',lineHeight:15,marginTop:5},fieldWrap:{flex:1,backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:9,padding:6},field:{color:C.ink,fontSize:14,fontWeight:'900',paddingVertical:2},calcBox:{backgroundColor:C.panel,borderRadius:9,padding:7,marginTop:1,marginBottom:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},calcValue:{color:C.blue,fontSize:17,fontWeight:'900'},voiceRow:{marginHorizontal:10,marginBottom:8,backgroundColor:C.paper,borderWidth:1,borderColor:C.line,borderRadius:10,padding:6,flexDirection:'row',alignItems:'center'},micButton:{width:38,height:38,borderRadius:19,backgroundColor:C.blue,alignItems:'center',justifyContent:'center'},micActive:{backgroundColor:C.red},micText:{fontSize:17,color:C.white},voiceTextWrap:{flex:1,paddingLeft:9},voiceTitle:{fontSize:8,fontWeight:'900',color:C.blue,letterSpacing:.8},voiceText:{fontSize:9,color:C.muted,marginTop:2},markGrid:{flexDirection:'row',flexWrap:'wrap',gap:6}
});