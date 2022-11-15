import { Survey, Surveys } from './surveystore.mjs'

class SurveyManager{

    /**
     * Make a new helper store
     */
    constructor(){
        this.surveys = new Surveys();
    }

    /**
     * Stores a survey
     * @param {Object} newValue topic string and option list  
     */
    storeSurvey(newValue){
        let survey = new Survey(newValue);
        this.surveys.saveSurvey(survey);
    }

    /**
     * Increment the count for an option in a topic
     * @param {Object} incDetails topic and option names
     */
    incrementCount(incDetails){
        let topic = incDetails.topic;
        let option = incDetails.option;
        let survey = this.surveys.getSurveyByTopic(topic);        
        survey.incrementCount(option);
    }


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
     * 
     * @param {topic of the survey} topic 
     * @returns topic and a list of option names
     */
    getOptions(topic){
        let survey = this.surveys.getSurveyByTopic(topic);
        return survey.getOptions();
    }
}

export {SurveyManager as SurveyHelper} ;

