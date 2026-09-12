import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, Pressable, View, Image, ScrollView, useWindowDimensions } from 'react-native';
import * as Location from 'expo-location';

const C={blue:'#0E3153',blue2:'#174F7A',gold:'#B78935',bg:'#ECE8DF',paper:'#F8F5EE',panel:'#E3DED3',line:'#C9C1B2',muted:'#6C7680',ink:'#102A42',green:'#2F6B4F',red:'#9B3A34',white:'#FFFFFF'};
const systems=[
  {id:'SIMULATOR',title:'DRC Simulator',sub:'Session and shot capture',icon:'◉'},
  {id:'RADAR',title:'DRC Radar',sub:'Sensor-ready speed and strike',icon:'⌁'},
  {id:'MAP',title:'DRC Map',sub:'Live phone GPS',icon:'◇'},
  {id:'SYNC',title:'DRC Sync',sub:'Connect systems',icon:'↻'}
];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function Header({title,home,metric,toggleUnits,ui}){
  return <View style={[s.header,{minHeight:ui.header}]}>
    {home?<Pressable onPress={home} hitSlop={10} style={({pressed})=>[s.homeButton,pressed&&s.pressed]}><Text style={s.homeButtonText}>‹ HOME</Text></Pressable>:<Image source={require('./content.png')} style={[s.logo,{width:ui.logo,height:ui.logo}]} resizeMode="contain"/>}
    <View style={s.headerText}><Text style={[s.brand,{fontSize:ui.brand}]}>{title||'DRC GOLF ELITE'}</Text><Text style={s.tag}>{home?'DRC ELITE GOLF':'4-IN-1 PERFORMANCE SYSTEM'}</Text></View>
    <Pressable onPress={toggleUnits} hitSlop={8} style={({pressed})=>[s.unitButton,pressed&&s.pressed]}><Text style={s.unitText}>{metric?'METRIC':'IMPERIAL'}</Text></Pressable>
  </View>
}
function Panel({title,children}){return <View style={s.panel}><Text style={s.panelTitle}>{title}</Text>{children}</View>}
function Metric({label,value,ui}){return <View style={[s.metricBox,{minHeight:ui.metric}]}><Text style={s.metricLabel}>{label}</Text><Text style={[s.metricValue,{fontSize:ui.metricText}]}>{value}</Text></View>}
function Button({label,onPress,secondary=false,disabled=false}){return <Pressable disabled={disabled} onPress={onPress} style={({pressed})=>[s.primaryButton,secondary&&s.secondaryButton,disabled&&s.disabled,pressed&&s.pressed]}><Text style={[s.primaryButtonText,secondary&&s.secondaryButtonText]}>{label}</Text></Pressable>}

function Home({open,metric,toggleUnits,ui}){
  return <View style={s.screen}><Header metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.homeScroll} showsVerticalScrollIndicator={false}>
    <View style={[s.hero,{padding:ui.pad}]}><Text style={s.heroSmall}>DRC ELITE GOLF</Text><Text style={[s.heroTitle,{fontSize:ui.title}]}>SELECT A SYSTEM</Text><Text style={s.heroText}>Live controls only. No demo readings.</Text></View>
    <View style={s.grid}>{systems.map(item=><Pressable key={item.id} onPress={()=>open(item.id)} style={({pressed})=>[s.launchCard,{height:ui.card,padding:ui.pad},pressed&&s.pressed]}><Text style={[s.icon,{fontSize:ui.icon}]}>{item.icon}</Text><Text style={[s.cardTitle,{fontSize:ui.cardTitle}]}>{item.title}</Text><Text style={s.cardSub}>{item.sub}</Text><View style={s.openBadge}><Text style={s.openText}>OPEN</Text></View></Pressable>)}</View>
  </ScrollView></View>
}

function Simulator({home,metric,toggleUnits,ui}){
  const [running,setRunning]=useState(false);
  const [shots,setShots]=useState([]);
  const addShot=()=>setShots(v=>[{id:Date.now(),club:'UNASSIGNED',distance:null},...v].slice(0,8));
  const clear=()=>setShots([]);
  return <View style={s.screen}><Header title="DRC SIMULATOR" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <Panel title="SESSION"><View style={s.statusRow}><Text style={s.statusLabel}>Session Status</Text><Text style={running?s.ready:s.standby}>{running?'ACTIVE':'STANDBY'}</Text></View>
      <View style={s.row}><Metric ui={ui} label="SHOTS" value={String(shots.length)}/><Metric ui={ui} label="DISTANCE" value="—"/></View>
      <Text style={s.note}>Simulator values stay blank until a real launch monitor or approved camera engine supplies data.</Text>
      <Button label={running?'STOP SESSION':'START SESSION'} onPress={()=>setRunning(v=>!v)}/>
      <Button label="RECORD SHOT EVENT" secondary disabled={!running} onPress={addShot}/>
    </Panel>
    <Panel title="SHOT LOG">{shots.length===0?<Text style={s.empty}>No shots recorded.</Text>:shots.map((x,i)=><View key={x.id} style={s.statusLine}><Text style={s.statusName}>SHOT {shots.length-i}</Text><Text style={s.standby}>AWAITING DATA</Text></View>)}{shots.length>0&&<Button label="CLEAR LOG" secondary onPress={clear}/>}</Panel>
  </ScrollView></View>
}

function Radar({home,metric,toggleUnits,ui}){
  const [armed,setArmed]=useState(false);
  return <View style={s.screen}><Header title="DRC RADAR" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <Panel title="RADAR LIVE"><View style={s.statusRow}><Text style={s.statusLabel}>Tracking Status</Text><Text style={armed?s.ready:s.standby}>{armed?'ARMED':'STANDBY'}</Text></View>
      <View style={s.row}><Metric ui={ui} label="CLUB SPEED" value="—"/><Metric ui={ui} label="BALL SPEED" value="—"/></View>
      <View style={s.row}><Metric ui={ui} label="SMASH" value="—"/><Metric ui={ui} label="TEMPO" value="—"/></View>
      <Text style={s.note}>No speed is fabricated. These fields only populate when a real radar/camera measurement source is connected.</Text>
      <Button label={armed?'DISARM RADAR':'ARM RADAR'} onPress={()=>setArmed(v=>!v)}/>
    </Panel>
    <Panel title="STRIKE"><View style={[s.strikeBox,{height:ui.visual}]}><View style={[s.strikeDot,!armed&&{opacity:.35}]}/><Text style={s.strikeText}>{armed?'WAITING FOR STRIKE':'RADAR NOT ARMED'}</Text></View></Panel>
  </ScrollView></View>
}

function MapScreen({home,metric,toggleUnits,ui}){
  const [status,setStatus]=useState('READY');
  const [position,setPosition]=useState(null);
  const [watching,setWatching]=useState(false);
  const watcher=useRef(null);

  const stopWatch=()=>{if(watcher.current){watcher.current.remove();watcher.current=null;}setWatching(false);};
  useEffect(()=>()=>stopWatch(),[]);

  const getPosition=async()=>{
    try{
      setStatus('REQUESTING PERMISSION');
      const {status:permission}=await Location.requestForegroundPermissionsAsync();
      if(permission!=='granted'){setStatus('PERMISSION DENIED');return;}
      setStatus('LOCATING');
      const p=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
      setPosition(p.coords); setStatus('GPS LOCKED');
    }catch(e){setStatus('GPS ERROR');}
  };
  const toggleLive=async()=>{
    if(watching){stopWatch();setStatus(position?'GPS LOCKED':'READY');return;}
    try{
      const {status:permission}=await Location.requestForegroundPermissionsAsync();
      if(permission!=='granted'){setStatus('PERMISSION DENIED');return;}
      setStatus('TRACKING');
      watcher.current=await Location.watchPositionAsync({accuracy:Location.Accuracy.High,distanceInterval:2,timeInterval:2000},p=>setPosition(p.coords));
      setWatching(true);
    }catch(e){setStatus('GPS ERROR');}
  };
  const speed=position&&typeof position.speed==='number'&&position.speed>=0?position.speed:null;
  const speedText=speed==null?'—':metric?`${(speed*3.6).toFixed(1)} kph`:`${(speed*2.23694).toFixed(1)} mph`;
  const accuracy=position?.accuracy?`${Math.round(position.accuracy)} m`:'—';
  return <View style={s.screen}><Header title="DRC MAP" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <Panel title="LIVE PHONE GPS"><View style={s.statusRow}><Text style={s.statusLabel}>GPS Status</Text><Text style={(status==='GPS LOCKED'||status==='TRACKING')?s.ready:status.includes('ERROR')||status.includes('DENIED')?s.error:s.standby}>{status}</Text></View>
      <View style={[s.mapBox,{height:ui.map}]}><Text style={s.flag}>⌖</Text><Text style={s.coord}>{position?position.latitude.toFixed(6):'—'}</Text><Text style={s.coord}>{position?position.longitude.toFixed(6):'—'}</Text></View>
      <View style={s.row}><Metric ui={ui} label="ACCURACY" value={accuracy}/><Metric ui={ui} label="DEVICE SPEED" value={speedText}/></View>
      <Button label="GET GPS POSITION" onPress={getPosition}/><Button label={watching?'STOP LIVE GPS':'START LIVE GPS'} secondary onPress={toggleLive}/>
      <Text style={s.note}>Course front/centre/back distances are intentionally not shown until verified course coordinates are loaded.</Text>
    </Panel>
  </ScrollView></View>
}

function Sync({home,metric,toggleUnits,ui}){
  const [connected,setConnected]=useState(false);
  const status=connected?'LINKED':'STANDBY';
  return <View style={s.screen}><Header title="DRC SYNC" home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/><ScrollView contentContainerStyle={s.scroll}>
    <Panel title="DRC SYNC"><View style={s.syncHero}><Text style={s.syncIcon}>↻</Text><Text style={s.syncTitle}>{connected?'SESSION LINKED':'READY TO LINK'}</Text><Text style={s.syncText}>Sync coordinates the four DRC modules. It does not invent unavailable sensor data.</Text></View><Button label={connected?'DISCONNECT':'CONNECT DRC SESSION'} onPress={()=>setConnected(v=>!v)}/></Panel>
    <Panel title="SYSTEM STATUS">{['SIMULATOR','RADAR','MAP'].map(name=><View key={name} style={s.statusLine}><Text style={s.statusName}>{name}</Text><Text style={connected?s.ready:s.standby}>{status}</Text></View>)}</Panel>
  </ScrollView></View>
}

export default function App(){
  const[screen,setScreen]=useState('HOME');
  const[metric,setMetric]=useState(true);
  const{width,height}=useWindowDimensions();
  const ui=useMemo(()=>({header:clamp(height*.075,60,72),logo:clamp(width*.11,40,50),brand:clamp(width*.044,16,20),title:clamp(width*.058,21,27),card:clamp(height*.175,126,154),pad:clamp(width*.03,10,14),icon:clamp(width*.07,25,31),cardTitle:clamp(width*.035,13,16),metric:clamp(height*.07,56,68),metricText:clamp(width*.037,14,17),visual:clamp(height*.14,105,130),map:clamp(height*.20,145,190)}),[width,height]);
  const home=()=>setScreen('HOME'); const toggleUnits=()=>setMetric(v=>!v);
  return <SafeAreaView style={s.safe}><StatusBar barStyle="dark-content" backgroundColor={C.bg}/>
    {screen==='HOME'&&<Home open={setScreen} metric={metric} toggleUnits={toggleUnits} ui={ui}/>} 
    {screen==='SIMULATOR'&&<Simulator home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/>} 
    {screen==='RADAR'&&<Radar home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/>} 
    {screen==='MAP'&&<MapScreen home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/>} 
    {screen==='SYNC'&&<Sync home={home} metric={metric} toggleUnits={toggleUnits} ui={ui}/>} 
  </SafeAreaView>
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},screen:{flex:1,backgroundColor:C.bg},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:C.line,backgroundColor:C.paper},logo:{marginRight:8},headerText:{flex:1},brand:{color:C.blue,fontWeight:'900'},tag:{color:C.gold,fontSize:8,fontWeight:'900',letterSpacing:1,marginTop:2},unitButton:{borderWidth:1,borderColor:C.blue,borderRadius:8,paddingHorizontal:7,paddingVertical:7},unitText:{color:C.blue,fontSize:8,fontWeight:'900'},homeButton:{borderWidth:1,borderColor:C.blue,borderRadius:8,paddingHorizontal:9,paddingVertical:9,marginRight:8},homeButtonText:{color:C.blue,fontSize:10,fontWeight:'900'},homeScroll:{paddingBottom:14},hero:{margin:10,marginBottom:8,borderRadius:12,backgroundColor:C.blue},heroSmall:{color:'#D9C8A2',fontSize:8,fontWeight:'900',letterSpacing:1.2},heroTitle:{color:C.white,fontWeight:'900',marginTop:2},heroText:{color:'#E8EEF4',fontSize:10,marginTop:3},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',paddingHorizontal:10},launchCard:{width:'48.7%',backgroundColor:C.paper,borderWidth:1,borderColor:C.line,borderRadius:12,marginBottom:9,overflow:'hidden'},pressed:{opacity:.65},icon:{color:C.blue,fontWeight:'900'},cardTitle:{color:C.blue,fontWeight:'900',marginTop:5},cardSub:{color:C.muted,fontSize:9,marginTop:3},openBadge:{marginTop:'auto',alignSelf:'flex-start',backgroundColor:C.blue,borderRadius:20,paddingHorizontal:11,paddingVertical:5},openText:{color:C.white,fontSize:8,fontWeight:'900'},scroll:{padding:10,paddingBottom:18},panel:{backgroundColor:C.paper,borderWidth:1,borderColor:C.line,borderRadius:12,padding:10,marginBottom:8},panelTitle:{color:C.blue,fontSize:10,fontWeight:'900',letterSpacing:1,marginBottom:8},statusRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:C.panel,borderRadius:8,paddingHorizontal:9,paddingVertical:7,marginBottom:7},statusLabel:{color:C.muted,fontSize:9,fontWeight:'800'},ready:{color:C.green,fontSize:9,fontWeight:'900'},standby:{color:C.gold,fontSize:9,fontWeight:'900'},error:{color:C.red,fontSize:9,fontWeight:'900'},row:{flexDirection:'row',gap:6,marginBottom:6},metricBox:{flex:1,backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:9,padding:8,justifyContent:'center'},metricLabel:{color:C.muted,fontSize:7.5,fontWeight:'900',letterSpacing:.7,marginBottom:4},metricValue:{color:C.ink,fontWeight:'900'},note:{color:C.muted,fontSize:10,lineHeight:15,marginTop:2,marginBottom:8},empty:{color:C.muted,fontSize:10,paddingVertical:10},strikeBox:{backgroundColor:C.panel,borderRadius:10,alignItems:'center',justifyContent:'center'},strikeDot:{width:22,height:22,borderRadius:11,backgroundColor:C.gold,borderWidth:3,borderColor:C.white},strikeText:{color:C.blue,fontSize:10,fontWeight:'900',marginTop:8,letterSpacing:1},mapBox:{borderRadius:10,backgroundColor:'#DDE3DC',borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginBottom:7},flag:{color:C.blue,fontSize:30},coord:{color:C.blue2,fontWeight:'900',fontSize:13,letterSpacing:.5,marginTop:3},syncHero:{alignItems:'center',paddingVertical:10},syncIcon:{color:C.blue,fontSize:34,fontWeight:'900'},syncTitle:{color:C.blue,fontSize:16,fontWeight:'900',marginTop:5},syncText:{color:C.muted,fontSize:10,textAlign:'center',marginTop:5,maxWidth:290},primaryButton:{backgroundColor:C.blue,borderRadius:9,paddingVertical:12,alignItems:'center',marginTop:8,borderWidth:1,borderColor:C.blue},primaryButtonText:{color:C.white,fontSize:10,fontWeight:'900',letterSpacing:.7},secondaryButton:{backgroundColor:C.paper},secondaryButtonText:{color:C.blue},disabled:{opacity:.35},statusLine:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#E7E1D7'},statusName:{color:C.ink,fontSize:10,fontWeight:'900'}
});
