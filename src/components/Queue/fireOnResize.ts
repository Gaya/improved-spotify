function dispatchOnResize() {
  const event = new Event('resize');
  window.dispatchEvent(event);
}

function fireOnResize(): void {
  const animationFrames = 7;
  const lastInterval = 400;

  for (let i = 1; i < animationFrames; i += 1) {
    setTimeout(dispatchOnResize, (lastInterval / animationFrames) * i);
  }
}

export default fireOnResize;
