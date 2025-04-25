import { useEffect } from 'react';

export function useDisableLiProcess(data: any) {
  const disableLi = (id: string) => {
    const liElement = document.querySelector(`[id$="${id}"]`) as HTMLElement;
    if (liElement) {
      liElement.style.pointerEvents = 'none';
      liElement.style.opacity = '0.5';
    }
  };

  const enableLi = (id: string) => {
    const liElement = document.querySelector(`[id$="${id}"]`) as HTMLElement;
    if (liElement) {
      liElement.style.pointerEvents = 'auto';
      liElement.style.opacity = '1';
    }
  };

  useEffect(() => {
    const idsHand = ['distillation', 'rectification', 'mashing'];
    const idsDist = ['manual', 'rectification', 'mashing'];
    const idsRect = ['manual', 'distillation', 'mashing'];
    const idsMash = ['manual', 'distillation', 'rectification'];
    const enableAll = ['manual', 'distillation', 'rectification', 'mashing'];

    const updateLiState = () => {
      if (data.distController >= 1 && data.distController != 4) {
        idsDist.forEach(disableLi);
      } else if (data.handController > 0) {
        idsHand.forEach(disableLi);
      } else if (data.rectController >= 1 && data.rectController != 6) {
        idsRect.forEach(disableLi);
      } else if (data.mashingController >= 1 && data.mashingController != 15) {
        idsMash.forEach(disableLi);
      } else if (
        data.distController === 0 &&
        data.handController === 0 &&
        data.rectController === 0 &&
        data.mashingController === 0
      ) {
        enableAll.forEach(enableLi);
      }
    };

    const observer = new MutationObserver(updateLiState);
    observer.observe(document.body, { childList: true, subtree: true });

    updateLiState();

    return () => observer.disconnect();
  }, [data.distAcceleration]);
}
