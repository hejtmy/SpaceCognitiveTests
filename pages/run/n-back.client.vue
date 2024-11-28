<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import instructions from '@jspsych/plugin-instructions';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import imageButtonResponse from '@jspsych/plugin-image-button-response'

// Initialize jsPsych
jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    const data = jsPsych.data.get().json()
  }
})

const nbackstimuliurl = client.storage.from("test-stimuli").getPublicUrl('nback/')
const randomNumbers = Array.from({length: 9}, () => Math.floor(Math.random() * 42) + 1)
const planetstimuli = randomNumbers.map(num => `${nbackstimuliurl.data.publicUrl}planets/nback_planet_${num}.png`);

console.log(planetstimuli)
const stimuli = planetstimuli

//TODO this needs to be same if the 
const generateSequence = (length) => {
  const sequence = []
  for (let i = 0; i < length; i++) {
    if (i >= 2 && Math.random() < 0.3) {
      sequence.push(sequence[i - 2])
    } else {
      sequence.push(stimuli[Math.floor(Math.random() * stimuli.length)])
    }
  }
  return sequence
}

const sequence = generateSequence(5)
const timeline = []

timeline.push({
  type: preload,
  images: stimuli,
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
    })
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
  
  // Create trials
  sequence.forEach((stimulus, index) => {
    const isTarget = index >= 2 && stimulus === sequence[index - 2]
    timeline.push({
      type: imageButtonResponse,
      stimulus: stimulus,
      choices: ['match'],
      stimulus_duration: null, // Show until response
      trial_duration: null, // No timeout
      margin_vertical: '10px',
      stimulus_height: 400,
      stimulus_width: 400,
      stimulus_duration: 3000,
      trial_duration: 3000,
      render_on_canvas: false, // Allows the image to be clickable
      button_class: 'jspsych-btn',
      data: {
        task: 'n-back',
        trial_index: index,
        stimulus: stimulus,
        is_target: isTarget,
        condition: '2-back'
      },
      on_finish: (data) => {
        // Score the response (1 = Match button clicked)
        data.correct = (isTarget && data.response === 1) || 
        (!isTarget && data.response === 0)
      },
      post_trial_gap: 500
    })
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
    choices: ['Finish'],
    on_finish: async () => {
      await save_test_data(jsPsych);
    }
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
    
    <!-- Site header -->
    <CestaHeader />
    
    <!-- Page content -->
    <main class="grow">
      <CestaTestFrame testName="N-Back paměťová úloha"/>
    </main>
    <CestaFooter />
  </div>
</template>
