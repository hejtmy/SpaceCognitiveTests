<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import browserCheck from '@jspsych/plugin-browser-check';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import { timeline_hideFooter, timeline_pcMouseWarning, timeline_confirmOfficialAttempt, timeline_saveAttemptData } from '~/utils/jsPsychUtils';

// CONSTANTS
const TEST_NAME = "spatial-cognition";
const POST_INSTRUCTIONS_DELAY = 2000;
const spatialurl = client.storage.from("test-stimuli").getPublicUrl('spatialcognition/')

// Initialize jsPsych
const jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

onMounted(() => {
  jsPsych.run(timeline)
})

function imagename (direction, distance, angle) {
  return `${spatialurl.data.publicUrl}map_${direction}_${distance}_${angle}.png`
}

function create_all_stimuli() {
  const directions = ["left", "right"];
  const distances = [1, 2, 3];
  const angles = [45, 90, 135];
  const all_stimuli = [];
  directions.forEach(direction => {
    distances.forEach(distance => {
      angles.forEach(angle => {
        all_stimuli.push(imagename(direction, distance, angle))
      })
    })
  })
  return all_stimuli;
}
const all_stimuli = create_all_stimuli();

function create_sequence(direction, rotations) {
  const sequence = []
  let distances = jsPsych.randomization.shuffle([1, 2, 3, 1, 2, 3])
  let angles = jsPsych.randomization.shuffle([45, 45, 90, 90, 135, 135])
  let rots = jsPsych.randomization.shuffle(rotations)
  // create an array of objects with the image name and the direction
  for (let i = 0; i < 6; i++) {
    sequence.push({
      image:imagename(direction, distances[i], angles[i]),
      rotation: rots[i]
    })
  }
  return sequence;
}

const first_rotation = Array(6).fill(0);
const second_rotation = Array(3).fill(0).concat(Array(3).fill(180));
const third_rotation = [0, 180, 90, 90, 270, 270];
let seq = create_sequence("left", first_rotation).
  concat(create_sequence("right", first_rotation));
const first_sequence = jsPsych.randomization.shuffle(seq);
seq = create_sequence("left", second_rotation).concat(create_sequence("right", second_rotation));
const second_sequence = jsPsych.randomization.shuffle(seq);
seq = create_sequence("left", third_rotation).concat(create_sequence("right", third_rotation));
const third_sequence = jsPsych.randomization.shuffle(seq);

function create_trial(stimulus, index) {
  return {
    type: htmlButtonResponse,
    stimulus: `<img src="${stimulus.image}" class="max-w-none rotate_${stimulus.rotation}" width="512" height="512" alt="Mapa">`,
    choices: ['< doleva', 'doprava >'],
    stimulus_duration: null, // Show until response
    trial_duration: null, // No timeout
    margin_vertical: '10px',
    render_on_canvas: true, // Allows the image to be clickable
    button_class: 'jspsych-btn',
    data: {
      trial_type: 'long',
      trial_index: index,
      stimulus: stimulus,
    },
    on_finish: (data) => { },
    post_trial_gap: 1000
  }
}

// TIMELINE ------------------
const timeline = [];
timeline.push({type:browserCheck});
timeline.push({type: preload, images: all_stimuli})
timeline.push(timeline_hideFooter());
timeline.push(timeline_pcMouseWarning());

if(user.value) {
  timeline.push(timeline_confirmOfficialAttempt());
  timeline.push(timeline_checkValidAttempt(client, user.value, TEST_NAME, jsPsych));
  timeline.push(timeline_abortOrCreateAttempt(client, user.value, TEST_NAME, jsPsych));
  
}

timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <p>Vítejte v testu Prostorové orientace!<p/>
    <p>V úloze uvidíš obrázky s raketou a vesmírnou stanicí. Tvým úkolem bude co nejrychleji určit, na kterou stranu musí raketa zatočit, aby ke stanici doletěla.</p>
    <p>Na obrázcích níže vidíš dva příklady. Na prvním obrázku musí raketa otočit doleva, a na tom druhém musí zatočit vpravo.</p>
    <img src="/images/tutorials/spatial-cognition/spatial-simple.png" class="max-w-none" style="margin:auto" width="512" height="512"/>
    <p> Na odpověď máš dostatek času, ale hodnotí se jak správná odpověď, tak i tvoje rychlost!</p>`,
  choices: ["Letíme!"],
  post_trial_gap: POST_INSTRUCTIONS_DELAY
});

first_sequence.forEach((stimulus, index) => {
  timeline.push(create_trial(stimulus, index));
})

// create a pause trial between the sequences
timeline.push({
  type: htmlButtonResponse,
  stimulus: `<p>Výborně, první fáze hotová!<p/> 
  <p> V další části raketa občas poletí směrem nahoru a občas směrem dolů. Tvým úkolem je opět správně a rychle určit směr, v jakém by raketa měla zatočit, aby doletěla ke stanici.</p>
  <img src="/images/tutorials/spatial-cognition/spatial-upsidedown.png" class="max-w-none" style="margin:auto" width="512" height="512"/>
  <p> Na prvním obrázku vidíš příklad, kde raketa letí směrem dolů a aby ke stanici doletěla, musí zatočit doleva. Na druhém obrázku letí nahoru a musí zatočit vpravo.</p>`,
  choices: ["Letíme!"],
  post_trial_gap: POST_INSTRUCTIONS_DELAY
});

second_sequence.forEach((stimulus, index) => {
  timeline.push(create_trial(stimulus, index));
})

// create a pause trial between the sequences
timeline.push({
  type: htmlButtonResponse,
  stimulus: `<p>Výborně. Zbývá poslední kus cesty!<p/>
  <p>Pozor, nyní se bude raketa ve vesmíru točit všemi čtyřmi směry. Občas poletí doprava, občas doleva, někdy nahoru a někdy dolů.</p>
  <p>Tvým úkolem je opět rychle a přesně určit, kam by měla raketa zatočit, aby doletěla ke stanici.</p>
  <img src="/images/tutorials/spatial-cognition/spatial-rotated.png" class="max-w-none" style="margin:auto" width="512" height="512"/>
  <p>Na prvním obrázku výše vidíš příklad, kde raketa letí směrem doprava a musí zatočit doleva, aby ke stanici doletěla. Na druhém obrázku musí zatočit doprava.</p>`,
  choices: ["Letíme!"],
  post_trial_gap: POST_INSTRUCTIONS_DELAY
});

third_sequence.forEach((stimulus, index) => {
  timeline.push(create_trial(stimulus, index));
})

timeline.push(timeline_saveAttemptData(client, user.value, TEST_NAME, jsPsych));
timeline.push(timeline_finalMessage());

</script>
<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <CestaTestFrame testName="Prostorová orientace"/>
    </main>
    <CestaFooter />
  </div>
</template>

<style>
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