'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const periods = { '1D': 1, '1W': 4.8, '1M': 18, '1Y': 92 } as const;
export type Flow3DPeriod = keyof typeof periods;

type Props = { period: Flow3DPeriod };
type FlowNode = { label: string; x: number; y: number; color: number; flow: number; path: string; detail: string; direction: string };
type FlowLink = { from: number; to: number; amount: number; kind: 'outflow' | 'inflow' };
type MapLevel = 0 | 1 | 2 | 3;
type SizeMetric = 'Market Size' | 'USD Turnover' | 'Relative Activity' | 'Volume' | 'Open Interest';
type ColorMetric = 'Performance' | 'Momentum' | 'Volatility' | 'Relative Strength';
type FlowMetric = 'Relative Activity Change' | 'Turnover Change' | 'Momentum Rotation' | 'Correlation Shift';
type MarketFilter = 'All Markets' | 'Stock' | 'Indices' | 'Forex' | 'Commodities' | 'Crypto';
const sizeMetrics: SizeMetric[] = ['Market Size', 'USD Turnover', 'Relative Activity', 'Volume', 'Open Interest'];
const colorMetrics: ColorMetric[] = ['Performance', 'Momentum', 'Volatility', 'Relative Strength'];
const flowMetrics: FlowMetric[] = ['Relative Activity Change', 'Turnover Change', 'Momentum Rotation', 'Correlation Shift'];
const marketFilters: MarketFilter[] = ['All Markets', 'Stock', 'Indices', 'Forex', 'Commodities', 'Crypto'];

function flowLabel(text: string, color: string) {
 const canvas = document.createElement('canvas');
 canvas.width = 180; canvas.height = 48;
 const context = canvas.getContext('2d');
 if (context) { context.fillStyle = 'rgba(255,255,255,.92)'; context.roundRect(2, 6, 176, 36, 10); context.fill(); context.fillStyle = color; context.font = '600 22px Geist, Arial'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(text, 90, 24); }
 const texture = new THREE.CanvasTexture(canvas); texture.minFilter = THREE.LinearFilter;
 const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
 sprite.scale.set(1.05, .28, 1);
 return sprite;
}

export function VolumeFlow3D({ period }: Props) {
 const host = useRef<HTMLDivElement>(null);
 const rotationRef = useRef<((delta: number) => void) | null>(null);
 const periodScale = periods[period];
 const [selected, setSelected] = useState<FlowNode | null>(null);
 const [level, setLevel] = useState<MapLevel>(0);
 const [marketFilter, setMarketFilter] = useState<MarketFilter>('All Markets');
 const [sizeMetric, setSizeMetric] = useState<SizeMetric>('Market Size');
 const [colorMetric, setColorMetric] = useState<ColorMetric>('Performance');
 const [flowMetric, setFlowMetric] = useState<FlowMetric>('Relative Activity Change');
 const [crumbs, setCrumbs] = useState(['Global']);

 const nodeBlueprints = level === 0 ? [
  ['Stock', -4.2, .6, 0x7c3aed, 1088.9, 'Global → Stock', 'Global equity market', 'Flow source'], ['Indices', -2.1, -1.2, 0x6d28d9, 1853.1, 'Global → Indices', 'Benchmark and index complex', 'Flow source'], ['Forex', -.8, 1.8, 0x0891b2, 105.1, 'Global → Forex', 'Currency market activity', 'Flow source'], ['Commodities', 1.5, -.9, 0xf59e0b, 135.9, 'Global → Commodities', 'Energy, metals, agriculture', 'Flow source'], ['Crypto', 3.9, 1.1, 0x4f46e5, 249, 'Global → Crypto', 'Digital asset market', 'Flow destination'],
 ] : level === 1 ? (marketFilter === 'Stock' || marketFilter === 'All Markets' ? [['USA', -3.2, .8, 0x7c3aed, 812.4, 'Global → Stock → USA', 'US stock market', 'Region'], ['Europe', -.8, -1, 0x8b5cf6, 244.1, 'Global → Stock → Europe', 'European stock market', 'Region'], ['Asia Pacific', 2.2, 1.3, 0xa78bfa, 391.8, 'Global → Stock → Asia Pacific', 'Asia-Pacific stock market', 'Region']] : [['Major', -2.8, .8, 0x0891b2, 405.3, 'Global → Forex → Major', 'Major currency pairs', 'Category'], ['Minor', 0, -1, 0x06b6d4, 121.4, 'Global → Forex → Minor', 'Minor currency pairs', 'Category'], ['Exotic', 2.9, 1.2, 0x22d3ee, 64.7, 'Global → Forex → Exotic', 'Exotic currency pairs', 'Category']]) : level === 2 ? [
  ['Technology', -3.2, .9, 0x7c3aed, 621.4, `${crumbs.join(' → ')} → Technology`, 'Technology sector / industry grouping', 'Sector'], ['Finance', -1, -1.15, 0x8b5cf6, 402.6, `${crumbs.join(' → ')} → Finance`, 'Financial services sector', 'Sector'], ['Healthcare', 1.3, 1.45, 0xa78bfa, 198.5, `${crumbs.join(' → ')} → Healthcare`, 'Healthcare sector', 'Sector'], ['Energy', 3.3, -.55, 0xf59e0b, 135.9, `${crumbs.join(' → ')} → Energy`, 'Energy and commodities sector', 'Sector'],
 ] : [
  ['NVDA', -2.7, .9, 0x7c3aed, 298.4, `${crumbs.join(' → ')} → NVDA`, 'NVIDIA · Semiconductors', 'Instrument'], ['AAPL', -.5, -1.1, 0x8b5cf6, 51.2, `${crumbs.join(' → ')} → AAPL`, 'Apple · Consumer technology', 'Instrument'], ['BTC', 2, 1.1, 0xf59e0b, 146.7, `${crumbs.join(' → ')} → BTC`, 'Bitcoin · Layer 1', 'Instrument'], ['ETH', 3.8, -.8, 0x4f46e5, 102.3, `${crumbs.join(' → ')} → ETH`, 'Ethereum · Layer 1', 'Instrument'],
 ];
 const visibleMarketNodes: FlowNode[] = nodeBlueprints.filter(node => marketFilter === 'All Markets' || level === 0 || marketFilter === 'Stock' || (marketFilter === 'Crypto' && ['BTC', 'ETH'].includes(node[0] as string))).map(node => ({ label: node[0] as string, x: node[1] as number, y: node[2] as number, color: node[3] as number, flow: node[4] as number, path: node[5] as string, detail: node[6] as string, direction: node[7] as string }));

 useEffect(() => {
  const element = host.current;
  if (!element) return;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf8f7fc, 10, 24);
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(0, 2.2, 11);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0xf8f7fc, 0);
  element.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 2.8);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0x7c3aed, 2.5);
  key.position.set(-4, 6, 5);
  scene.add(key);

  const group = new THREE.Group();
  group.rotation.x = -.08;
  scene.add(group);
  const nodes = visibleMarketNodes;
  const nodeObjects: THREE.Mesh[] = [];
  nodes.forEach(node => {
  const metricFactor = sizeMetric === 'Relative Activity' ? 1.15 : sizeMetric === 'Open Interest' ? .8 : sizeMetric === 'USD Turnover' ? 1.05 : sizeMetric === 'Volume' ? .92 : 1;
  const radius = .18 + Math.min(.7, Math.sqrt(node.flow / 1100) * .48 * metricFactor);
  const color = colorMetric === 'Momentum' ? (node.flow > 300 ? 0x10b981 : 0xf59e0b) : colorMetric === 'Volatility' ? 0xef4444 : colorMetric === 'Relative Strength' ? 0x0891b2 : node.color;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 20), new THREE.MeshStandardMaterial({ color, roughness: .32, metalness: .12, transparent: true, opacity: .92 }));
   mesh.position.set(node.x, node.y, 0);
   mesh.userData.label = node.label;
   group.add(mesh);
   nodeObjects.push(mesh);
  });

  const flowLines: THREE.Line[] = [];
  const links: FlowLink[] = nodes.slice(0, -1).map((_, index) => ({ from: index, to: index + 1, amount: Math.max(18, nodes[index].flow * .24), kind: index >= Math.max(1, nodes.length - 2) ? 'inflow' : 'outflow' as 'inflow' | 'outflow' }));
  links.forEach((link, index) => {
   const { from, to } = link;
   const start = nodeObjects[from].position;
   const end = nodeObjects[to].position;
   const curve = new THREE.CatmullRomCurve3([start, new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2 + (index % 2 ? .45 : -.35), .45), end]);
   const points = curve.getPoints(48);
   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: link.kind === 'inflow' ? 0x10b981 : 0xef4444, transparent: true, opacity: .7 }));
    line.userData.phase = index * .7;
   group.add(line);
   flowLines.push(line);
  const direction = end.clone().sub(start).normalize();
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(.12, .34, 12), new THREE.MeshStandardMaterial({ color: link.kind === 'inflow' ? 0x10b981 : 0xef4444, roughness: .35, depthTest: false }));
  arrow.position.copy(end).sub(direction.clone().multiplyScalar(.38));
  arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  group.add(arrow);
  const label = flowLabel(`${link.kind === 'inflow' ? '+' : '-'}${(link.amount * periodScale).toFixed(1)}M`, link.kind === 'inflow' ? '#047857' : '#b91c1c');
  label.position.copy(curve.getPoint(.52)); label.position.z += .12; group.add(label);
  });

  const grid = new THREE.GridHelper(14, 28, 0xd8d3e8, 0xe8e5f0);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -.7;
  grid.material.transparent = true;
  grid.material.opacity = .38;
  group.add(grid);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const resize = () => { const width = element.clientWidth; const height = element.clientHeight; camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
    rotationRef.current = (delta: number) => { group.rotation.y += delta; };
    const pointerPosition = (event: PointerEvent) => { const rect = renderer.domElement.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; };
    const pointerDown = (event: PointerEvent) => { dragging = true; lastX = event.clientX; lastY = event.clientY; renderer.domElement.setPointerCapture(event.pointerId); };
    const pointerMove = (event: PointerEvent) => { if (!dragging) return; group.rotation.y += (event.clientX - lastX) * .006; group.rotation.x += (event.clientY - lastY) * .004; lastX = event.clientX; lastY = event.clientY; };
    const pointerUp = (event: PointerEvent) => { dragging = false; renderer.domElement.releasePointerCapture(event.pointerId); };
    const click = (event: MouseEvent) => { pointerPosition(event as unknown as PointerEvent); raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(nodeObjects)[0]; if (hit?.object.userData.node) { const node = hit.object.userData.node as FlowNode; setSelected(node); if (level < 3) { setCrumbs(current => [...current, node.label]); setLevel(current => Math.min(3, current + 1) as MapLevel); } } };
    const wheel = (event: WheelEvent) => { camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * .006, 7, 15); };
    nodeObjects.forEach((mesh, index) => { mesh.userData.node = nodes[index]; });
    renderer.domElement.addEventListener('pointerdown', pointerDown); renderer.domElement.addEventListener('pointermove', pointerMove); renderer.domElement.addEventListener('pointerup', pointerUp); renderer.domElement.addEventListener('click', click); renderer.domElement.addEventListener('wheel', wheel, { passive: true });
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(element);
  let animation = 0;
  const clock = new THREE.Clock();
  const render = () => {
  const elapsed = clock.getElapsedTime();
   nodeObjects.forEach((mesh, index) => { mesh.position.z = Math.sin(elapsed * 1.2 + index) * .08; mesh.scale.setScalar(1 + Math.sin(elapsed * 1.5 + index) * .025); });
   flowLines.forEach((line, index) => { const material = line.material as THREE.LineBasicMaterial; material.opacity = .3 + (Math.sin(elapsed * 2 + index) + 1) * .16; });
   renderer.render(scene, camera);
   animation = requestAnimationFrame(render);
  };
  render();
    return () => { cancelAnimationFrame(animation); observer.disconnect(); renderer.domElement.removeEventListener('pointerdown', pointerDown); renderer.domElement.removeEventListener('pointermove', pointerMove); renderer.domElement.removeEventListener('pointerup', pointerUp); renderer.domElement.removeEventListener('click', click); renderer.domElement.removeEventListener('wheel', wheel); renderer.dispose(); element.removeChild(renderer.domElement); group.clear(); };
 }, [periodScale, level, marketFilter, sizeMetric, colorMetric, flowMetric]);

 return <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-500">{crumbs.map((crumb, index) => <span key={`${crumb}-${index}`} className="flex items-center gap-1"><button onClick={() => { setCrumbs(crumbs.slice(0, index + 1)); setLevel(Math.min(index, 3) as MapLevel); setSelected(null); }} className="hover:text-violet-700">{crumb}</button>{index < crumbs.length - 1 && <span>→</span>}</span>)}</div><div className="flex flex-wrap gap-2"><select aria-label="Flow size by" value={sizeMetric} onChange={event => setSizeMetric(event.target.value as SizeMetric)} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600">{sizeMetrics.map(item => <option key={item}>{item}</option>)}</select><select aria-label="Flow color by" value={colorMetric} onChange={event => setColorMetric(event.target.value as ColorMetric)} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600">{colorMetrics.map(item => <option key={item}>{item}</option>)}</select><select aria-label="Flow by" value={flowMetric} onChange={event => setFlowMetric(event.target.value as FlowMetric)} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600">{flowMetrics.map(item => <option key={item}>{item}</option>)}</select><select aria-label="Market filter" value={marketFilter} onChange={event => { setMarketFilter(event.target.value as MarketFilter); setLevel(0); setCrumbs(['Global']); setSelected(null); }} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600">{marketFilters.map(item => <option key={item}>{item}</option>)}</select><button onClick={() => { setLevel(0); setCrumbs(['Global']); setSelected(null); }} className="secondary">Reset</button></div></div><div className="relative"><div ref={host} className="h-72 w-full cursor-grab overflow-hidden rounded-xl border border-border bg-[#f8f7fc] active:cursor-grabbing" aria-label={`3D volume flow from stocks to BTC and ETH for ${period}`} />{selected && <div className="absolute bottom-3 left-3 max-w-64 rounded-xl border border-violet-200 bg-white/95 p-3 shadow-lg"><div className="flex items-start justify-between gap-4"><div><b className="text-xs text-slate-900">{selected.label}</b><p className="mt-1 text-[9px] text-slate-500">{selected.path}</p></div><button aria-label="Close flow detail" onClick={() => setSelected(null)} className="text-slate-400">×</button></div><div className="mt-2 text-[10px] text-slate-600">{selected.detail}</div><div className="mt-2 flex justify-between text-[9px]"><span className="text-violet-600">{selected.direction}</span><span className="font-mono text-slate-500">{(selected.flow * periodScale).toFixed(1)}M proxy</span></div></div>}<div className="absolute right-3 top-3 flex items-center gap-1"><button aria-label="Rotate left" onClick={() => rotationRef.current?.(-.28)} className="grid size-7 place-items-center rounded-lg border border-border bg-white/90 text-sm text-slate-600 shadow-sm hover:bg-violet-50">←</button><button aria-label="Rotate right" onClick={() => rotationRef.current?.(.28)} className="grid size-7 place-items-center rounded-lg border border-border bg-white/90 text-sm text-slate-600 shadow-sm hover:bg-violet-50">→</button></div><div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/80 px-2 py-1 text-[9px] text-slate-500">Drag to rotate · Scroll to zoom</div></div></div>;
}
