<script setup>
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

// Define stimuli
const stimuli = [
'/images/stimuli/nback/1.png',
'/images/stimuli/nback/2.png',
'/images/stimuli/nback/3.png',
'/images/stimuli/nback/4.png',
'/images/stimuli/nback/5.png',
]

// Generate sequence with some 2-back matches
const generateSequence = (length) => {
  const sequence = []
  for (let i = 0; i < length; i++) {
    if (i >= 2 && Math.random() < 0.3) {
      // 30% chance of 2-back match
      sequence.push(sequence[i - 2])
    } else {
      sequence.push(stimuli[Math.floor(Math.random() * stimuli.length)])
    }
  }
  return sequence
}

const sequence = generateSequence(10)
const timeline = []

timeline.push({
  type: preload,
  images: stimuli
})

// Instructions
timeline.push({
  type: htmlButtonResponse,
  stimulus: `
          <div class="max-w-2xl mx-auto text-center">
            <h1 class="text-2xl font-bold mb-4">2-Back Task</h1>
            <p class="mb-2">You will see a series of images.</p>
            <p class="mb-2">Click on the image if it matches the image shown 2 trials ago.</p>
            <p class="mb-4">Otherwise, click "No Match" to continue.</p>
          </div>
        `,
  choices: ['Start'],
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
  choices: ['Finish']
})


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


<style>
/* Add any custom styles for jsPsych elements here */
.jspsych-content {
  max-width: 800px;
}

.jspsych-display-element {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 50vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.jspsych-btn {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
}

.jspsych-image-button-response-button-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>