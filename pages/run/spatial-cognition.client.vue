<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import { useRouter } from 'vue-router';
import {initJsPsych} from 'jspsych';
import callFuncion from '@jspsych/plugin-call-function';
import preload from '@jspsych/plugin-preload';
import instructions from '@jspsych/plugin-instructions';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'

// Initialize jsPsych
jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

const timeline = [];

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
const testpreload = {
  type: preload,
  images: all_stimuli,
};

timeline.unshift(testpreload);

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

var welcome = {
  type: htmlButtonResponse,
  stimulus: "Vítejte v testu prostorové kognice.",
  choices: ["Pokračovat"]
};

var testinstructions = {
  type: instructions,
  pages: [`
      <p>V úloze uvidíte obrázky s raketou a vesmírnou stanicí a vaším úkolem bude určit, zda se raketa pohybuje doprava nebo doleva.</p>
  `],
   choices: ['Souhlasím, pokračovat'],
    show_clickable_nav: true
};
timeline.push(testinstructions);

function create_trial(stimulus, index) {
  return {
    type: htmlButtonResponse,
    stimulus: `<img src="${stimulus.image}" class="max-w-none rotate_${stimulus.rotation}" width="512" height="512" alt="Mapa">`,
    choices: ['doleva', 'doprava'],
    stimulus_duration: null, // Show until response
    trial_duration: null, // No timeout
    margin_vertical: '10px',
    stimulus_height: 512,
    stimulus_width: 512,
    render_on_canvas: true, // Allows the image to be clickable
    button_class: 'jspsych-btn',
    data: {
      trial_type: 'long',
      trial_index: index,
      stimulus: stimulus,
    },
    on_finish: (data) => { },
    post_trial_gap: 0
  }
}

first_sequence.forEach((stimulus, index) => {
  timeline.push(create_trial(stimulus, index));
})

// create a pause trial between the sequences
timeline.push({
  type: htmlButtonResponse,
  stimulus: "Přestávka. V další části bude raketka občas směřovat nahoru a občas dolů. Nezapomeňte určit směr, v jakém by letět měla raketa, ne, na jaké straně obrazovky vidíte stanici. Až budete připraveni, můžete pokračovat.",
  choices: ["Pokračovat"]
});

second_sequence.forEach((stimulus, index) => {
  timeline.push(create_trial(stimulus, index));
})

// create a pause trial between the sequences
timeline.push({
  type: htmlButtonResponse,
  stimulus: "Poslední přestávka a poslední kus cesty. Nyní se bude vesmír točit všemy směry. Až budete připraveni, můžete pokračovat.",
  choices: ["Pokračovat"]
});

third_sequence.forEach((stimulus, index) => {
  timeline.push(create_trial(stimulus, index));
})

// push a timeline event which simply saves the data and on finish goes further
timeline.push({
  type: callFuncion,
  async: true,
  func: async (done) => {
    await save_test_data(jsPsych);
    done();
  }
})

timeline.push({
  type: htmlButtonResponse,
  stimulus: "Děkujeme za zvládnutí.",
  choices: ["K testům"],

  // redirect to list of test on button click
  on_finish: () => {
    navigateTo('/tests')
  }
});

// create a saving call function
async function save_test_data(jspsych){
  if (client == null) {
    console.error('Supabase client is not available');
    return
  }
  try {
    const test_data = jspsych.data.get().json();
    const updates = {
      test_name: 'Spatial Cognition',
      test_results: test_data,
    }
    const { error } = await client.from('TestResults').insert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
  }
}

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