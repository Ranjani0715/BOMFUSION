export interface NonLinearProgressOptions {
  onProgress: (percent: number) => void;
  onStatusMessage?: (message: string) => void;
  onCounterUpdate?: (current: number) => void;
  statusMessages?: string[];
  totalItems?: number;
  onComplete: () => void;
}

export function runNonLinearProgress({
  onProgress,
  onStatusMessage,
  onCounterUpdate,
  statusMessages = [],
  totalItems = 25,
  onComplete,
}: NonLinearProgressOptions) {
  let isCancelled = false;

  // Multi-phase timeline
  const phases = [
    { target: 15, duration: 280 },
    { target: 42, duration: 1400 },
    { target: 42, duration: 600 }, // pause
    { target: 71, duration: 900 },
    { target: 71, duration: 800 }, // pause
    { target: 94, duration: 500 },
    { target: 94, duration: 400 }, // pause
    { target: 100, duration: 200 },
  ];

  let currentPercent = 0;
  let phaseIdx = 0;

  // Handle Status Messages at irregular intervals
  let msgTimer: NodeJS.Timeout | null = null;
  if (onStatusMessage && statusMessages.length > 0) {
    let msgIdx = 0;
    onStatusMessage(statusMessages[0]);

    const scheduleNextMsg = () => {
      if (isCancelled || msgIdx >= statusMessages.length - 1) return;
      // Irregular interval between 400ms and 1200ms
      const delays = [400, 900, 1200, 600, 800, 1100, 500];
      const randomDelay = delays[msgIdx % delays.length];
      msgTimer = setTimeout(() => {
        if (isCancelled) return;
        msgIdx++;
        onStatusMessage(statusMessages[msgIdx]);
        if (msgIdx < statusMessages.length - 1) {
          scheduleNextMsg();
        }
      }, randomDelay);
    };

    scheduleNextMsg();
  }

  // Handle Counter
  let counterTimer: NodeJS.Timeout | null = null;
  if (onCounterUpdate && totalItems > 0) {
    let currentItem = 1;
    onCounterUpdate(1);

    const stepCounter = () => {
      if (isCancelled || currentItem >= totalItems) return;
      const counterDelays = [160, 210, 180, 240, 190, 150, 220];
      const delay = counterDelays[currentItem % counterDelays.length];
      counterTimer = setTimeout(() => {
        if (isCancelled) return;
        currentItem++;
        onCounterUpdate(currentItem);
        if (currentItem < totalItems) {
          stepCounter();
        }
      }, delay);
    };

    stepCounter();
  }

  // Step through progress phases
  const executePhase = () => {
    if (isCancelled) return;
    if (phaseIdx >= phases.length) {
      if (onStatusMessage) onStatusMessage('Finalizing results...');
      setTimeout(() => {
        if (!isCancelled) {
          onProgress(100);
          onComplete();
        }
      }, 300);
      return;
    }

    const { target, duration } = phases[phaseIdx];
    const startVal = currentPercent;
    const startTime = performance.now();

    const animateStep = (now: number) => {
      if (isCancelled) return;
      const elapsed = now - startTime;
      const progressRatio = Math.min(1, elapsed / duration);
      currentPercent = startVal + (target - startVal) * progressRatio;
      onProgress(Math.round(currentPercent));

      if (progressRatio < 1) {
        requestAnimationFrame(animateStep);
      } else {
        phaseIdx++;
        executePhase();
      }
    };

    requestAnimationFrame(animateStep);
  };

  executePhase();

  return () => {
    isCancelled = true;
    if (msgTimer) clearTimeout(msgTimer);
    if (counterTimer) clearTimeout(counterTimer);
  };
}

export function revealRowsStaggered<T>(
  items: T[],
  onRowReveal: (revealedItems: T[]) => void,
  onFinished?: () => void
) {
  let revealed: T[] = [];
  let index = 0;

  const revealNext = () => {
    if (index >= items.length) {
      if (onFinished) onFinished();
      return;
    }

    revealed = [...revealed, items[index]];
    onRowReveal(revealed);
    index++;

    // Randomized delay between 60ms and 130ms per row
    const randomDelay = Math.floor(Math.random() * 70) + 60;
    setTimeout(revealNext, randomDelay);
  };

  revealNext();
}

export function runTypewriter(
  fullText: string,
  onUpdate: (currentText: string) => void,
  charDelayMs = 25,
  onComplete?: () => void
) {
  let index = 0;
  const timer = setInterval(() => {
    index++;
    onUpdate(fullText.slice(0, index));
    if (index >= fullText.length) {
      clearInterval(timer);
      if (onComplete) onComplete();
    }
  }, charDelayMs);

  return () => clearInterval(timer);
}
