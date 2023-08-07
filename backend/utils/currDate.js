const getCurrDate = () => {
    const currDate = new Date

    const validCurrDate = currDate.toDateString().split(' ').splice(1,3)

    if(validCurrDate[0] === "Jan") {
        validCurrDate.splice(0, 1, '01')
    } else if (validCurrDate[0] === "Feb"){
        validCurrDate.splice(0, 1, '02')
    } else if (validCurrDate[0] === "Mar"){
        validCurrDate.splice(0, 1, '03')
    } else if (validCurrDate[0] === "Apr"){
        validCurrDate.splice(0, 1, '04')
    } else if (validCurrDate[0] === "May"){
        validCurrDate.splice(0, 1, '05')
    } else if (validCurrDate[0] === "Jun"){
        validCurrDate.splice(0, 1, '06')
    } else if (validCurrDate[0] === "Jul"){
        validCurrDate.splice(0, 1, '07')
    } else if (validCurrDate[0] === "Aug"){
        validCurrDate.splice(0, 1, '08')
    } else if (validCurrDate[0] === "Sep"){
        validCurrDate.splice(0, 1, '09')
    } else if (validCurrDate[0] === "Oct"){
        validCurrDate.splice(0, 1, '10')
    } else if (validCurrDate[0] === "Nov"){
        validCurrDate.splice(0, 1, '11')
    } else if (validCurrDate[0] === "Dec"){
        validCurrDate.splice(0, 1, '12')
    }

    return validCurrDate
}

module.exports = {
    getCurrDate
}