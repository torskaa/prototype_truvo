import { instruments, technicalBars } from '@market/data/mock-market';
import type { TvBar, TvDatafeed, TvDatafeedConfiguration, TvResolution, TvSymbolInfo } from './datafeed-types';

const resolutions:TvResolution[]=['1','5','15','60','240','1D','1W','1M'];
const config:TvDatafeedConfiguration={supported_resolutions:resolutions,exchanges:[{value:'NASDAQ',name:'NASDAQ',desc:'NASDAQ'},{value:'CRYPTO',name:'Crypto',desc:'Digital assets'},{value:'FX',name:'Forex',desc:'Foreign exchange'}],symbols_types:[{name:'Stocks',value:'stock'},{name:'Crypto',value:'crypto'},{name:'Forex',value:'forex'}],supports_search:true,supports_marks:true,supports_timescale_marks:true,supports_time:true};
const anchor=Date.UTC(2026,7,31,2,0,0);
const intervalMs:Record<TvResolution,number>={'1':60_000,'5':300_000,'15':900_000,'60':3_600_000,'240':14_400_000,'1D':86_400_000,'1W':604_800_000,'1M':2_592_000_000};

function symbolInfo(symbol:string):TvSymbolInfo|undefined { const item=instruments.find(i=>i.symbol===symbol||i.symbol.replace('/','')===symbol); if(!item)return; const type=item.market==='Crypto'?'crypto':item.market==='Forex'?'forex':'stock'; const exchange=type==='crypto'?'CRYPTO':type==='forex'?'FX':'NASDAQ'; return {ticker:item.symbol,name:item.symbol,description:item.name,type,session:type==='crypto'||type==='forex'?'24x7':'0930-1600',timezone:'Etc/UTC',exchange,listed_exchange:exchange,format:'price',pricescale:item.price<10?100000:100,minmov:1,has_intraday:true,has_daily:true,has_weekly_and_monthly:true,supported_resolutions:resolutions,volume_precision:2,data_status:'delayed_streaming'}; }
function makeBars(symbol:string,resolution:TvResolution):TvBar[]{const item=instruments.find(i=>i.symbol===symbol)??instruments[0];const delta=item.price-technicalBars[technicalBars.length-1].close;const step=intervalMs[resolution];return technicalBars.map((bar,index)=>({time:anchor-(technicalBars.length-1-index)*step,open:bar.open+delta,high:bar.high+delta,low:bar.low+delta,close:bar.close+delta,volume:bar.volume*1_000_000}));}

export function createMockTradingViewDatafeed():TvDatafeed {
 const subscriptions=new Map<string,ReturnType<typeof setInterval>>();
 return {
  onReady(cb){setTimeout(()=>cb(config),0)},
  searchSymbols(input,exchange,symbolType,cb){const q=input.toLowerCase();cb(instruments.filter(i=>(!q||`${i.symbol} ${i.name}`.toLowerCase().includes(q))&&(!exchange||symbolInfo(i.symbol)?.exchange===exchange)&&(!symbolType||symbolInfo(i.symbol)?.type===symbolType)).map(i=>{const info=symbolInfo(i.symbol)!;return {symbol:i.symbol,full_name:`${info.exchange}:${i.symbol}`,description:i.name,exchange:info.exchange,ticker:i.symbol,type:info.type}}))},
  resolveSymbol(symbol,onResolve,onError){const info=symbolInfo(symbol.includes(':')?symbol.split(':')[1]:symbol);setTimeout(()=>info?onResolve(info):onError(`Unknown mock symbol: ${symbol}`),0)},
  getBars(info,resolution,period,onResult,onError){try{const bars=makeBars(info.ticker,resolution);const requested=bars.filter(b=>b.time>=period.from*1000&&b.time<period.to*1000);const result=(requested.length?requested:bars.slice(-Math.max(1,period.countBack))).sort((a,b)=>a.time-b.time);setTimeout(()=>onResult(result,{noData:result.length===0}),0)}catch(error){onError(error instanceof Error?error.message:'Mock bar error')}},
  subscribeBars(info,resolution,onTick,subscriberUid){let sequence=0;const bars=makeBars(info.ticker,resolution);const seed={...bars[bars.length-1]};const timer=setInterval(()=>{sequence+=1;const shift=Math.sin(sequence/3)*.08;onTick({...seed,close:seed.close+shift,high:Math.max(seed.high,seed.close+shift),low:Math.min(seed.low,seed.close+shift),volume:(seed.volume??0)+sequence*1200})},2500);subscriptions.set(subscriberUid,timer)},
  unsubscribeBars(subscriberUid){const timer=subscriptions.get(subscriberUid);if(timer)clearInterval(timer);subscriptions.delete(subscriberUid)},
  getServerTime(cb){cb(Math.floor(anchor/1000))},
 };
}
