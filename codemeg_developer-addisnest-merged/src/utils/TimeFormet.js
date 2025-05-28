import moment from 'moment';

function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}

export const TimeChange = (date) => {
    if(date){
        return moment(date, "HH:mm:ss").format("h:mm a");
    }else{
        return '';  
    }
   
};