<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import callFuncion from '@jspsych/plugin-call-function';
import instructions from '@jspsych/plugin-instructions';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import imageButtonResponse from '@jspsych/plugin-image-button-response'

//CONSTANTS
const NUMBER_OF_STIMULI = 42
const NUMBER_OF_TRIALS = 9
const TRIAL_DURATION = 1000
const IMAGE_WIDTH = 512
const IMAGE_HEIGHT = 512
const N_BACK = 2
const N_REPEATED_TRIALS = 3

function selectAndDuplicateStrings(arr, n_back, n_back_count) {
  var newArr = [...arr];
  newArr.splice(4, 0, arr[2]);
  newArr.splice(7, 0, arr[4]);
  newArr.splice(8, 0, arr[5]);
  return newArr;
  if (arr.length < n_back + 1) {
    throw new Error("Array must contain at least n + 1 elements.");
  }
  // Select 3 random unique indices
  const selectedIndices = [];
  while (selectedIndices.length < n_back_count) {
    const randomIndex = Math.floor(Math.random() * (arr.length - n_back));
    if (!selectedIndices.includes(randomIndex)) {
      selectedIndices.push(randomIndex);
    }
  }

  selectedIndices.sort((a, b) => a - b);
  // create a new array of object with selected indices and new indices
  let newPositions = selectedIndices.map((index) => {
    return { element: arr[index], oldIndex: index, newIndex: index + n_back};
  });
// for each element in new positions if the old index of the following elements is equal or lower than the new index of the current element, increase the new index of the following elements by 1
  newPositions.forEach((element, i) => {
    newPositions.slice(i + 1).forEach((nextElement) => {
      if (nextElement.oldIndex < element.newIndex) {
        nextElement.newIndex++;
      }
      if (nextElement.oldIndex < element.oldIndex) {
        nextElement.newIndex++;
      }
    });
  });
  let newarr = [...arr];
  // Duplicate the selected strings at index + 2 position
  newPositions.forEach(obj => {
    if (obj.newIndex < arr.length) {
      newarr.splice(obj.newIndex, 0, obj.element);
    } else {
      newarr.push(obj.element);
    }
  });
  return newarr;
}

// Initialize jsPsych
jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

const nbackstimuliurl = client.storage.from("test-stimuli").getPublicUrl('nback/')
function generate_stimuli_sequence (n_trials, n_stimuli, folder, prefix, n_repeated) {
  const randomNumbers = Array.from({length: n_trials}, 
    () => Math.floor(Math.random() * n_stimuli) + 1)
  const stimuli = randomNumbers.map(num => `${nbackstimuliurl.data.publicUrl}${folder}/${prefix}${num}.png`);
  return stimuli;
}

let planetstimuli = generate_stimuli_sequence(NUMBER_OF_TRIALS, NUMBER_OF_STIMULI, 'planets', 'nback_planet_')
planetstimuli = selectAndDuplicateStrings(planetstimuli, N_BACK, N_REPEATED_TRIALS)
let abstractstimuli = generate_stimuli_sequence(NUMBER_OF_TRIALS, NUMBER_OF_STIMULI, 'abstract', 'nback_abstract_')
abstractstimuli = selectAndDuplicateStrings(abstractstimuli, N_BACK, N_REPEATED_TRIALS)

let timeline = [];

timeline.push({
  type: preload,
  images: planetstimuli.concat(abstractstimuli),
})

if(user.value) {
  timeline.push({
    type: instructions,
    pages: [
    `<div class="max-w-2xl mx-auto text-center">
        <h1 class="text-2xl font-bold mb-4">2-Back Task</h1>
        <p class="mb-4">Official attempt.</p>`
      ],
      choices: ['Souhlasím, pokračovat'],
      show_clickable_nav: true
    }
  )
}
  
// Instructions
timeline.push({
  type: htmlButtonResponse,
  stimulus: `
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-2xl font-bold mb-4">2-Back Task</h1>
      <p class="mb-2">Postupně uvidíte sérii několika obrázků</p>
      <p class="mb-2">Klikněte na tlačítko "Viděl/ajsem, pokud obrázek jste viděli jako předminulý" </p>
      <p class="mb-4">Jinak počkejte až se objeví další.</p>
    </div>
  `,
  choices: ['Začít'],
  post_trial_gap: 1000
})

function generate_timeline_sequence(stimuli, duration, width, height) {
  let sequence_trials = []
  stimuli.forEach((stimulus, index) => {
    const isTarget = index >= 2 && stimulus === stimuli[index - 2]
    const trial = {
      type: imageButtonResponse,
      stimulus: stimulus,
      choices: ['match'],
      margin_vertical: '10px',
      stimulus_height: height,
      stimulus_width: width,
      stimulus_duration: duration,
      trial_duration: duration,
      render_on_canvas: false,
      button_class: 'jspsych-btn',
      data: {
        trial_index: index,
        stimulus: stimulus,
        is_target: isTarget,
      },
      on_finish: (data) => {
        data.correct = (isTarget && data.response === 1) || 
        (!isTarget && data.response === 0)
      },
      post_trial_gap: 500
    }
    sequence_trials.push(trial);
  }
  )
  return sequence_trials;
}

const planet_sequence = generate_timeline_sequence(planetstimuli, TRIAL_DURATION, IMAGE_WIDTH, IMAGE_HEIGHT);
const abstract_sequence = generate_timeline_sequence(abstractstimuli, TRIAL_DURATION, IMAGE_WIDTH, IMAGE_HEIGHT);

timeline.push(...planet_sequence)
timeline.push({
  // button response with a pause screen 
  type: htmlButtonResponse,
  stimulus: `
    <div class="text-center">
      <h2 class="text-xl font-bold mb-4">Pauza</h2>
      <p>Chvíli si odpočiňte a pak pokračujte dál.</p>
    </div>
  `,
  choices: ['Pokračovat'],
  post_trial_gap: 2000
})
timeline.push(...abstract_sequence)

// push a timeline event which simply saves the data and on finish goes further
timeline.push({
  type: callFuncion,
  async: true,
  func: async (done) => {
    await save_test_data(jsPsych);
    done();
  }
})

// End message
timeline.push({
  type: htmlButtonResponse,
  stimulus: `
        <div class="text-center">
          <h2 class="text-xl font-bold mb-4">Task Complete!</h2>
          <p>Thank you for participating.</p>
        </div>
`,
  choices: ['Zpět k testům']
})

async function save_test_data(jspsych){
  if (client == null) {
    console.error('Supabase client is not available');
    return
  }
  try {
    const test_data = jspsych.data.get().json();
    const updates = {
      test_name: '2-Back Task',
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
      <CestaTestFrame testName="N-Back paměťová úloha"/>
    </main>
    <CestaFooter />
  </div>
</template>
