import englishToEngli from './engli';
import { wouldBeInstant } from './engli';

const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const output = document.querySelector<HTMLTextAreaElement>('#output')!; // read only
const confidence = document.querySelector<HTMLDivElement>('#confidence')!;
const inputChars = document.querySelector<HTMLDivElement>('#input-chars')!;
const outputChars = document.querySelector<HTMLDivElement>('#output-chars')!;

let typingTimeout: any | undefined = undefined;

function setConfidence(value: number) {
  let color = '#84d35980';
  let text = 'This is a fully accurate translation.';
  if (value < 0.5) {
    color = '#ff4a4a80';
    text = 'This is a very inaccurate translation.';
  }
  else if (value <= 0.75) {
    color = '#d3a52f80';
    text = 'This is a somewhat inaccurate translation.';
  } else if (value < 1) {
    color = '#c3d33380';
    text = 'This is a good but imperfect translation.';
  }
  // add (value * 100)% confidence
  text += `\n(${Math.round(value * 100)}% confidence)`;
  text += `\n<progress value="${value}" max="1"></progress>`
  confidence.style.outlineColor = color;
  confidence.innerHTML = text;
}

function updateChars() {
  inputChars.innerHTML = input.value.length.toString();
  outputChars.innerHTML = output.value.length.toString();
}

input.addEventListener('input', async () => {
  if (typingTimeout !== undefined) {
    clearTimeout(typingTimeout);
  }

  // if its empty, set it to empty
  if (input.value.trim() === '') {
    output.value = '';
    confidence.innerHTML = '';
    confidence.style.outlineColor = 'transparent';
    updateChars();
    return;
  }

  const instant = wouldBeInstant(input.value);
  if (instant) {
    let translation = await englishToEngli(input.value);
    output.value = translation.engli;
    setConfidence(translation.confidence);
    updateChars();
  }
  else {
    output.value = '...';
    confidence.innerHTML = '';
    confidence.style.outlineColor = 'transparent';
    outputChars.innerHTML = '...';
    typingTimeout = setTimeout(async () => {
      let translation = await englishToEngli(input.value);
      output.value = translation.engli;
      setConfidence(translation.confidence);
      updateChars();
    }, 500);
  }
});