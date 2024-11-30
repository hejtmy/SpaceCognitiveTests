<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import callFuncion from '@jspsych/plugin-call-function';
import preload from '@jspsych/plugin-preload';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import { timeline_hideFooter } from '~/utils/jsPsychUtils';

const N_TRIALS = 6;
const POST_INSTRUCTIONS_DELAY = 2000;

// Initialize jsPsych
jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

const spatialurl = client.storage.from("test-stimuli").getPublicUrl('spatialcognition/')
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
// TIMELINE ---
const timeline = [];
timeline.push(timeline_hideFooter());
timeline.unshift({
  type: preload,
  images: all_stimuli,
})

timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <p>Vítejte v testu Prostorové kognice!<p/>
    <p>V úloze uvidíte obrázky s raketou a vesmírnou stanicí. Vaším úkolem bude co nejrychleji určit, na kterou stranu musí raketa zatočit, aby ke stanici doletěla.</p>
    <p>Na obrázcích níže vidíte pár příkladů. V na prvním obrázku musí otočit doleva, a na tom druhém musí zatočit vpravo.</p>
    <img src="/images/tutorials/spatial-cognition/spatial-simple.png" class="max-w-none" style="margin:auto" width="512" height="512"/>
    <p> Na odpověď máte dostatek času, ale hodnotí se jak správná odpověď, tak i vaše rychlost.</p>`,
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
  <p> V další části raketa občas poletí směrem nahoru a občas směrem dolů. Vaším úkolem je opět správně a rychle určit směr, v jakém by raketa měla zatočit, aby doletěla správně ke stanici.</p>
  <img src="/images/tutorials/spatial-cognition/spatial-upsidedown.png" class="max-w-none" style="margin:auto" width="512" height="512"/>
  <p> Na prvním obrázku výše vidíte příklad, kde raketa letí směrem dolů a musí zatočit doleva, aby ke stanici doletěla. Na druhém obrázku letí nahoru a musí zatočit vpravo.</p>`,
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
  <p>Pozor, nyní bude raketa točit bude vesmír točit všemy čtyřmi směry. Občas poletí doprava, občas doleva, někdy nahoru a někdy dolů.</p>
  <p>Vaším úkolem je opět rychle a přesně určit, kam by měla raketa zatočit, aby doletěla ke stanici.</p>
  <img src="/images/tutorials/spatial-cognition/spatial-upsidedown.png" class="max-w-none" style="margin:auto" width="512" height="512"/>
  <p>Na prvním obrázku výše vidíte příklad, kde raketa letí směrem doprava a musí zatočit doleva, aby ke stanici doletěla. Na druhém obrázku musí zatočit doprava.</p>`,
  choices: ["Letíme!"],
  post_trial_gap: POST_INSTRUCTIONS_DELAY
});

third_sequence.forEach((stimulus, index) => {
  timeline.push(create_trial(stimulus, index));
})

timeline.push({
  type: callFuncion,
  async: true,
  func: async (done) => {
    await save_test_data(jsPsych, client);
    done();
  }
})

timeline.push({
  type: htmlButtonResponse,
  stimulus: "Výborně. Test Prostorové kognice je hotový!",
  choices: ["Zpět k testům"],
  on_finish: () => {
    navigateTo('/tests')
  }
});

onMounted(() => {
  jsPsych.run(timeline)
})

</script>
<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <CestaTestFrame testName="Prostorová kognice"/>
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