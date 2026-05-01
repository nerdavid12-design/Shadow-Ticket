import { isAdsRemoved, setAdsRemoved } from './storage';

type AdResult = 'shown' | 'dismissed' | 'error' | 'removed';

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const AdService = {
  async showInterstitial(): Promise<AdResult> {
    if (isAdsRemoved()) return 'removed';
    console.log('[AdService] Interstitial ad requested');
    await delay(1000);
    console.log('[AdService] Interstitial ad shown');
    return 'shown';
  },

  async showRewarded(): Promise<AdResult> {
    if (isAdsRemoved()) {
      console.log('[AdService] Ads removed — hint granted free');
      return 'removed';
    }
    console.log('[AdService] Rewarded ad requested');
    await delay(1000);
    console.log('[AdService] Rewarded ad completed — hint unlocked');
    return 'shown';
  },

  removeAds(): void {
    setAdsRemoved();
    console.log('[AdService] Ads removed via IAP');
  },

  isRemoved(): boolean {
    return isAdsRemoved();
  },
};
