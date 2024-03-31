function formatDate() {
    const date = new Date(); // 현재 날짜 가져오기
    const year = date.getFullYear().toString().slice(-2); // 연도의 마지막 두 자리
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (1을 더함)
    const day = date.getDate().toString().padStart(2, '0'); // 일
  
    return `${year}-${month}-${day}`;
}
  
module.exports = formatDate;
