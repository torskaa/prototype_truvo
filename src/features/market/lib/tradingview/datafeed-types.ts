export type TvResolution='1'|'5'|'15'|'60'|'240'|'1D'|'1W'|'1M';
export type TvBar={time:number;open:number;high:number;low:number;close:number;volume?:number};
export type TvSymbolInfo={ticker:string;name:string;description:string;type:string;session:string;timezone:string;exchange:string;listed_exchange:string;format:'price';pricescale:number;minmov:number;has_intraday:boolean;has_daily:boolean;has_weekly_and_monthly:boolean;supported_resolutions:TvResolution[];volume_precision:number;data_status:'streaming'|'delayed_streaming'|'endofday'};
export type TvDatafeedConfiguration={supported_resolutions:TvResolution[];exchanges:Array<{value:string;name:string;desc:string}>;symbols_types:Array<{name:string;value:string}>;supports_search:boolean;supports_marks:boolean;supports_timescale_marks:boolean;supports_time:boolean};
export type TvPeriodParams={from:number;to:number;countBack:number;firstDataRequest:boolean};
export type TvSearchResult={symbol:string;full_name:string;description:string;exchange:string;ticker:string;type:string};
export interface TvDatafeed {
 onReady(cb:(config:TvDatafeedConfiguration)=>void):void;
 searchSymbols(input:string,exchange:string,symbolType:string,cb:(items:TvSearchResult[])=>void):void;
 resolveSymbol(symbol:string,onResolve:(info:TvSymbolInfo)=>void,onError:(reason:string)=>void):void;
 getBars(info:TvSymbolInfo,resolution:TvResolution,period:TvPeriodParams,onResult:(bars:TvBar[],meta:{noData:boolean})=>void,onError:(reason:string)=>void):void;
 subscribeBars(info:TvSymbolInfo,resolution:TvResolution,onTick:(bar:TvBar)=>void,subscriberUid:string,onReset:()=>void):void;
 unsubscribeBars(subscriberUid:string):void;
 getServerTime(cb:(time:number)=>void):void;
}
