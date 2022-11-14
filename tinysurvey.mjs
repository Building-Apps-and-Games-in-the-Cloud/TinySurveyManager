import { SurveyHelper as SurveyManager } from './surveymanager.mjs';
import express from 'express';
import cookieParser from 'cookie-parser';

// Create the express application
const app = express();

// Create a survey manager
let surveyManager = new SurveyManager();
// Initialize the survey manager
surveyManager.init();

const port = 8080;

// Select ejs middleware
app.set('view-engine', 'ejs');

// Select the middleware to decode incoming posts
app.use(express.urlencoded({ extended: false }));

// Add the cookie parser middleware
app.use(cookieParser());

// Home page
app.get('/index.html', (request, response) => {
  response.render('index.ejs');
});

// Got the survey topic
app.post('/gottopic', (request, response) => {
  let topic = request.body.topic;

  let survey = surveyManager.surveyExists(topic);

  if (!survey) {
    // need to make a new survey
    response.render('enteroptions.ejs',
      { topic: topic, numberOfOptions: 5 });
  }
  else {
    // Need to check if the survey has already been filled in

    if (request.cookies.completedSurveys) {
      // Got a completed surveys cookie
      let completedSurveys = JSON.parse(request.cookies.completedSurveys);

      if (completedSurveys.includes(topic)) {
        // This survey has already been filled in at this browser
        // Just display the results
        let results = surveyManager.getCounts(topic);
        response.render('displayresults.ejs', results);
      }
    }
    else {
      // enter scores on an existing survey
      let surveyOptions = surveyManager.getOptions(topic);
      response.render('selectoption.ejs', surveyOptions);
    }
  }
});

// Got the options for a new survey
app.post('/setoptions/:topic', (request, response) => {
  let topic = request.params.topic;
  let options = [];
  let optionNo = 1;
  do {
    // construct the option name
    let optionName = "option" + optionNo;
    // fetch the text for this option from the request body
    let optionText = request.body[optionName];
    // If there is no text - no more options
    if (optionText == undefined) {
      break;
    }
    // Make an option value 
    let optionValue = { text: optionText, count: 0 };
    // Store it in the array of options
    options.push(optionValue);
    // Move on to the next option
    optionNo++;
  } while (true);

  // Build a survey value
  let newSurvey = { topic: topic, options: options };

  // save it
  surveyManager.storeSurvey(newSurvey);

  // Render the survey page
  let surveyOptions = surveyManager.getOptions(topic);
  response.render('selectoption.ejs', surveyOptions);
});

// Got the selections for a survey
app.post('/recordselection/:topic', (request, response) => {
  let topic = request.params.topic;
  if (!surveyManager.surveyExists(topic)) {
    response.status(404).send('<h1>Survey not found</h1>');
  }
  else {
    let completedSurveysJSON = request.cookies.completedSurveys;
    let completedSurveys;
    if (completedSurveysJSON) {
      // Got a completed surveys cookie string - parse it
      completedSurveys = JSON.parse(completedSurveysJSON);
    }
    else {
      // no surveys yet
      completedSurveys = [];
    }

    if (!completedSurveys.includes(topic)) {
      // This survey has not been filled in at this browser
      let optionSelected = request.body.selections;
      // Build an increment description
      let incDetails = {topic:topic, option:optionSelected};
      surveyManager.incrementCount(incDetails);
      completedSurveys.push(topic);
      completedSurveysJSON = JSON.stringify(completedSurveys);
      response.cookie("completedSurveys", completedSurveysJSON);
    }
    let results = surveyManager.getCounts(topic);
    response.render('displayresults.ejs', results);
  }
});

// Get the results for a survey
app.get('/displayresults/:topic', (request, response) => {
  let topic = request.params.topic;
  if (!surveyManager.surveyExists(topic)) {
    response.status(404).send('<h1>Survey not found</h1>');
  }
  else {
    let results = surveyManager.getCounts(topic);
    response.render('displayresults.ejs', results);
  }
});

app.listen(port, () => {
  console.log("Server running");
})