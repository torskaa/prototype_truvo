import type { Tier } from '@market/types';
export const tierRank:Record<Tier,number>={GUEST:0,BASIC:1,INTERMEDIATE:2,PREMIUM:3};
export const featureTier = { saveWatchlist:'BASIC', basicAlert:'BASIC', advancedScreener:'INTERMEDIATE', savedLayouts:'INTERMEDIATE', correlation:'INTERMEDIATE', advisorSignals:'INTERMEDIATE', eventIntelligence:'INTERMEDIATE', capitalFlow:'PREMIUM', multiFactorAlert:'PREMIUM', advancedAI:'PREMIUM', export:'PREMIUM', webhook:'PREMIUM', orderFlow:'PREMIUM' } as const;
export type Feature=keyof typeof featureTier;
export const can=(tier:Tier,feature:Feature)=>tierRank[tier]>=tierRank[featureTier[feature]];
