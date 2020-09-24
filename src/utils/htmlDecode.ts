function htmlDecode(input: string): string {
  const e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? '' : e.childNodes[0].textContent || '';
}

export default htmlDecode;
