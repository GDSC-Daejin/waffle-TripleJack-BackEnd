// dateUtils.js
function formatDate(date) {
    // 함수 내용
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
    const day = date.getDate();

    // 월과 일이 한 자리 수일 경우 앞에 0을 붙여줌
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    // YY-MM-DD 형식으로 반환
    return `${year}-${formattedMonth}-${formattedDay}`;
}
    const today = new Date();
    const formattedDate = formatDate(today);
    console.log(formattedDate); // 예: "2024-03-29"
  
module.exports = formatDate;