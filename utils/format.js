//格式化时间格式
class Format {
    static fomatterDateTime = (str, date = new Date()) => {
        let dateTime = date;
        let year = dateTime.getFullYear();
        let mouth = addzero(dateTime.getMonth() + 1);
        let day = addzero(dateTime.getDate());
        let hour = addzero(dateTime.getHours());
        let minute = addzero(dateTime.getMinutes());
        let second = addzero(dateTime.getSeconds());
        let milliseconds = addzero(dateTime.getMilliseconds());

        function addzero(num) {
            if (Number(num) < 10) {
                return '0' + num;
            }
            return num
        }

        switch (str) {
            case "yyyy.MM.dd":
                return `${year}.${mouth}.${day}`;
            case "hh:mm":
                return `${hour}:${minute}`;
            case "hh:mm:ss":
                return `${hour}.${minute}.${second}`;
            case "yyyy-MM-dd hh:mm:ss":
                return `${year}-${mouth}-${day} ${hour}:${minute}:${second}`;
            case "yyyyMMdd":
                return `${year}${mouth}${day}`;
            case "yyyyMMddhhmmss.ms":
                return `${year}${mouth}${day}${hour}${minute}${second}${milliseconds}`;
        }
        return ''
    };
}

module.exports = Format;
