

let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voiceSelect');
  voiceSelect.innerHTML = '';
  voices.forEach((voice, i) => {
    if (voice.lang.includes('en')) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = voice.name + ' (' + voice.lang + ')';
      voiceSelect.appendChild(option);
    }
  });
};

document.getElementById('fileInput').addEventListener('change', handleFile);
let uploadedText = "";

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedText = e.target.result;
  };
  reader.readAsText(file);
}

async function generateBriefing() {
  if (!uploadedText) {
    alert("Please upload a file first.");
    return;
  }

  const prompt = `You are a clinical assistant. Read the following dental schedule and generate a spoken-style briefing like a dentist would hear before seeing patients. Make it natural and clinical. File contents:\n\n${uploadedText}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const briefingText = data.choices?.[0]?.message?.content || "Error generating briefing.";
  document.getElementById("output").textContent = briefingText;

  const selectedVoiceIndex = document.getElementById('voiceSelect').value;
  const utterance = new SpeechSynthesisUtterance(briefingText);
  utterance.voice = voices[selectedVoiceIndex];
  window.speechSynthesis.speak(utterance);
}
