module.exports = {
    getStrCurrentDate: function () {
        var cur_date = new Date();
        var month = cur_date.getMonth() + 1;
        if(month < 10)
            month = '0' + month;
        var date = cur_date.getDate();
        if(date < 10)
            date = '0' + date;
        return cur_date.getFullYear() + '-' + month + '-' + date;
    }
};