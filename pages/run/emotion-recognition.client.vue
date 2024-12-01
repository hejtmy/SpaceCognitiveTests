<script setup>

const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import callFuncion from '@jspsych/plugin-call-function';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { timeline_pcMouseWarning, timeline_hideFooter, timeline_confirmOfficialAttempt } from '~/utils/jsPsychUtils';

// CONSTANTS -------
const N_IMAGES = 21;
const TEST_NAME = "emotion-recognition";
const EMOTIONS = ['neutral', 'sad', 'happy', 'surprised', 'angry'];
const EMOTION_CHOICES = ['Neutrálně', 'Smutně', 'Vesele', 'Překvapeně', 'Naštvaně'];
const EMOTION_STIMULI_URL = client.storage.from("test-stimuli").getPublicUrl('emotions/');
const DURATION = 500;

jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

function create_stimuli(emotionurl, mode, emotion, n_images){
  const possible_images = Array.from({length: N_IMAGES}, (_, i) => i + 1)
  const selected_images = jsPsych.randomization.sampleWithoutReplacement(possible_images, n_images);
  const stimuli = selected_images.map(num => `${emotionurl.data.publicUrl}/${mode}/${emotion}_${num}.png`);
  return stimuli;
}

function create_final_stimuli(emotionurl, mode, n_images){
}

function extract_emotion(url){
  return url;
} 

function create_long_trial(index, stimulus, rotation) { 
  const emotion = extract_emotion(stimulus);
  const trial = {
    type: htmlButtonResponse,
    stimulus: `<img src="${stimulus}" class="max-w-none rotate_${rotation}" width="512" height="512" alt="Mapa">`,
    choices: EMOTION_CHOICES,
    button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`,
    post_trial_gap: 1000,
    data: {
      index: index,
      emotion: emotion,
    }
  }
  return trial;
}

function create_short_trial(index, stimulus, duration) {
  const emotion = extract_emotion(stimulus);
  const trial = {
    type: htmlButtonResponse,
    stimulus: `<img src="${stimulus}" class="max-w-none" width="512" height="512" alt="Mapa">`,
    stimulus_duration: duration,
    trial_duration: duration,
    choices: [],
    data: {
      index: index,
      emotion: emotion,
    }
  };

  const answer = {
    type: htmlButtonResponse,
    stimulus: `<p>Jakou emoci jste postřehli na obrázku?</p>`,
    choices: EMOTION_CHOICES,
    button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`,
    post_trial_gap: 500,
    data: {
      emotion: emotion,
    }
  }
  return [trial, answer];

}
// All stimuli for preload
let all_stimuli = [];

// First block -----------
// Long trials 
let stimuli = [];

EMOTIONS.forEach((emotion, index) => {
  const emotion_stimuli = create_stimuli(EMOTION_STIMULI_URL, "training", emotion, 3);
  stimuli = stimuli.concat(emotion_stimuli);
});
stimuli = jsPsych.randomization.shuffle(stimuli);
const first_block = stimuli.map((stimulus, index) => {
  return create_long_trial(index, stimulus, 0);
});
all_stimuli = all_stimuli.concat(stimuli);

// second block -----------
stimuli = [];
EMOTIONS.forEach((emotion, index) => {
  const emotion_stimuli = create_stimuli(EMOTION_STIMULI_URL, "training", emotion, 3);
  stimuli = stimuli.concat(emotion_stimuli);
});
all_stimuli = all_stimuli.concat(stimuli);
stimuli = jsPsych.randomization.shuffle(stimuli);

const second_block = stimuli.map((stimulus, index) => {
  return create_short_trial(index, stimulus, DURATION);
});

// third block -----------
stimuli = [];
EMOTIONS.forEach((emotion, index) => {
  const emotion_stimuli = create_stimuli(EMOTION_STIMULI_URL, "training", emotion, 3);
  stimuli = stimuli.concat(emotion_stimuli);
});
all_stimuli = all_stimuli.concat(stimuli);
stimuli = jsPsych.randomization.shuffle(stimuli);
const rotations = jsPsych.randomization.shuffle(
                  [0, 0, 0, 
                   90, 90, 90, 90, 90,
                   180, 180, 180, 180, 180, 
                   270, 270, 270, 270, 270]);
const third_block = stimuli.map((stimulus, index) => {
  return create_long_trial(index, stimulus, rotations[index]);
});

// TIMELINE -------

var timeline = [];
timeline.push(timeline_hideFooter());
timeline.push(timeline_pcMouseWarning());

timeline.unshift({
  type: preload,
  images: all_stimuli,
});

if(user.value) {
  timeline.push(timeline_confirmOfficialAttempt());
  // record official attempt in a database
}

var testinstructions = {
  type: htmlButtonResponse,
  stimulus: `<p>V tomto testu budeš mít za úkol rozlišit základní emoce</p>
    <p>Na obrazovce se ti vždy zobrazí jeden obrázek s obličejem. Tvým úkolem je určit, jak se asi osoba cítí </p>.
    <div class="flex justify-center">
      <img src="/images/tutorials/emotions/happy.png" class="max-w-none" width="256" height="256" alt="happy">
      <img src="/images/tutorials/emotions/sad.png" class="max-w-none" width="256" height="256" alt="sad">
    </div>
    <p> Budeš mít na výběr z: <p/> 
    <p> <b> ${EMOTION_CHOICES.join(", ")}</b> </p>
    <p> Měříme jak správnost, tak i rychlost odpovědi.</p>`,
   choices: ['Jdeme na to!'],
   show_clickable_nav: true
};

timeline.push(testinstructions);
timeline.push(first_block);

timeline.push({
  type: htmlButtonResponse,
  stimulus: `<div class="text-center">
      <h2 class="text-xl font-bold mb-4">První fáze hotová!</h2>
      <p>Teď to bude trochu těžší. Obrázek se ti ukáže jen na chvilku. Tvým úkolem bude opět určit, jak se osoba cítila. Výběr emocí je stejný. Hodnotíme pouze správnost odpovědi. </p>
      <p> Až budeš připravený/á, pokračuj dál.</p>
    </div>`,
  choices: ['Pokračovat']
})
timeline.push(second_block);

timeline.push({
  type: htmlButtonResponse,
  stimulus: `<div class="text-center">
      <h2 class="text-xl font-bold mb-4">A teď finále!</h2>
      <p>Neboť ve vesmíru se může snadno stát, že uvidíš něčí obličej vzhůru nohama, v této fázi bude tvůj úkol určit emoci na různě natočených obličejích. Hodnotíme tvojí rychlost a správnost.</p>
      <img src="/images/tutorials/emotions/happy.png" class="max-w-none rotate_90" width="256" height="256" alt="happy">
      <img src="/images/tutorials/emotions/sad.png" class="max-w-none rotate_180" width="256" height="256" alt="sad">
      <p> Až budeš připravený/á, pokračuj dál.</p>
    </div>`,
  choices: ['Pokračovat']
})
timeline.push(third_block);

timeline.push({
  type: callFuncion,
  async: true,
  func: async (done) => {
    await save_test_data(jsPsych, TEST_NAME, client);
    done();
  }
})

timeline.push({
  type: htmlButtonResponse,
  stimulus: `<div class="text-center">
      <h2 class="text-xl font-bold mb-4">Perketní!</h2>
      <p>Gratulujeme k úspšššnému zakončení</p>
    </div>`,
  choices: ['Ukončit test'],
  on_finish: () => {
    navigateTo('/tests');
  }
})

onMounted(() => {
  jsPsych.run(timeline)
})

</script>
<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <CestaTestFrame testName="Rozpoznávání emocí"/>
    </main>
    <CestaFooter />
  </div>
</template>

<style>
.btn-emotion{
  flex-wrap: wrap!important;
  max-width: 100%;
}

.div-emotion{
  margin: auto;
  justify-content: center;
  width: 512px;
  height: 512px;
}

.img-emotion{
  width: 100%;
  height: 100%;
}
.rotate_90{
  transform: rotate(90deg);
}
.rotate_180{
  transform: rotate(180deg);
}
.rotate_270{
  transform: rotate(270deg);
}
</style>