import { useEffect } from 'react';

export function useDisableLiProcess(data: any) {
  const disableLi = (id: string) => {
    const liElement = document.getElementById(id);
    if (liElement) {
      liElement.style.pointerEvents = 'none';
      liElement.style.opacity = '0.5';
    }
  };

  const enableLi = (id: string) => {
    const liElement = document.getElementById(id);
    if (liElement) {
      liElement.style.pointerEvents = 'auto';
      liElement.style.opacity = '1';
    }
  };

  /* distController */
  useEffect(() => {
    const idsHand = ['pr_id_4_1_1', 'pr_id_4_1_2', 'pr_id_4_1_3'];
    const idsDist = ['pr_id_4_1_0', 'pr_id_4_1_2', 'pr_id_4_1_3'];
    const idsRect = ['pr_id_4_1_0', 'pr_id_4_1_1', 'pr_id_4_1_3'];
    const idsMash = ['pr_id_4_1_0', 'pr_id_4_1_1', 'pr_id_4_1_2'];
    const enableAll = ['pr_id_4_1_0', 'pr_id_4_1_1', 'pr_id_4_1_2', 'pr_id_4_1_3'];

    /*     const updateLiState = () => {
      enableAll.forEach(enableLi);
      if (data.distAcceleration === 100) {
        idsHand.forEach(disableLi);
      } else if (data.distAcceleration === 99) {
        idsDist.forEach(disableLi);
      } else if (data.distAcceleration === 98) {
        idsRect.forEach(disableLi);
      } else if (data.distAcceleration === 97) {
        idsMash.forEach(disableLi);
      }
    }; */

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
