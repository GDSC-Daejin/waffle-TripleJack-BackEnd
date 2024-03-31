// 오늘 날짜에서 특정 일 수를 더해 'YY-MM-DD' 형식의 날짜 문자열 반환
function addDaysAndGetFormattedDate(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
  
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  module.exports = addDaysAndGetFormattedDate;
  