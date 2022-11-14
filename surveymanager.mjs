import { Survey, Surveys } from './surveystore.mjs'

class SurveyManager{

    /**
     * Make a new helper. Note that it will need to be initialised
     * before use
     */
    constructor(){
        this.surveys = null;
    }

    /** 
     * Initialise the survey helper
     */
    init(){
        this.surveys = new Surveys();
    }

    /**
     * Stores a survey
     * @param {topic} string and option list newValue 
     */
    storeSurvey(newValue){
        let survey = new Survey(newValue);
        this.surveys.saveSurvey(survey);
    }

    /**
     * Increment the count for an option in a topic
     * @param {topic and option string} incDetails 
     */
    incrementCount(incDetails){
        let topic = incDetails.topic;
        let option = incDetails.option;
        let survey = this.surveys.getSurveyByTopic(topic);        
        survey.incrementCount(option);
    }

    /**
     * 
     * @param {string} topic of the survey
     * @returns true if the survey exists
     */
    surveyExists(topic){
        return this.surveys.getSurveyByTopic(topic) != undefined;
    }

    /**
     * 
     * @param {string} topic of the survey
     * @returns topic and a list of option names and counts
     */
    getCounts(topic){
        let survey = this.surveys.getSurveyByTopic(topic);
        return survey.getCounts();
    }

    /**
     * get 
     * @param {topic of the survey} topic 
     * @returns topic and a list of option names
     */
    getOptions(topic){
        let survey = this.surveys.getSurveyByTopic(topic);
        return survey.getOptions();
    }
}

export {SurveyManager as SurveyHelper} ;

