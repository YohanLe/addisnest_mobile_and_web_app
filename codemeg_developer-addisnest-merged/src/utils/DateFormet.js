import moment from 'moment';

function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}

export const DateChange = (date) => {
    if(isValidDate(date)==true){
        return moment(date).format('LL');  
    }else{
        return '';
    }
    
};