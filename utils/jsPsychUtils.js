import 'jspsych/css/jspsych.css';
import {initJsPsych} from 'jspsych';
import preload from '@jspsych/plugin-preload';
import callFuncion from '@jspsych/plugin-call-function';
import instructions from '@jspsych/plugin-instructions';
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import imageButtonResponse from '@jspsych/plugin-image-button-response'

export const timeline_hideFooter = () => {
  const trial = {
    type: callFuncion,
    func: () => {
     const element = document.getElementById("footer-div");
     if (element) {
       element.style.display = "none";
     } else {
       console.error("Footer (footer-div) not found");
     }
    }
  }
  return trial;
}
