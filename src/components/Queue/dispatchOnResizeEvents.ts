function dispatchOnResizeOnWindow() {
  const event = new Event('resize');
  window.dispatchEvent(event);
}

function dispatchOnResizeEvents(): void {
  const animationFrames = 7;
  const lastInterval = 400;

  for (let i = 1; i < animationFrames; i += 1) {
    setTimeout(dispatchOnResizeOnWindow, (lastInterval / animationFrames) * i);
  }
}

export default dispatchOnResizeEvents;
