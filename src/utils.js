import moment from "moment";


export function getLocalDateTime(created_at_str) {
    if (created_at_str.at(-1) === "Z")
        return moment(created_at_str);

    return moment(created_at_str + 'Z');
}

export function getLocalDateTimeStr(created_at_str) {
    var createdAtObject = getLocalDateTime(created_at_str);
    var createdAt = createdAtObject.format('lll')
    return createdAt;
};


export function filterAssgns(assignments, dateFilter) {
    if (!assignments || !dateFilter.length)
        return assignments;

    return assignments.filter((assgn) => {
        const deadline = getLocalDateTime(assgn.deadline);
        const filterStartDate = moment(dateFilter[0]).hour(0).minute(0).second(0);
        const filterEndDate = moment(dateFilter[1]).hour(23).minute(59).second(59);
        return (filterStartDate <= deadline && deadline <= filterEndDate);
    })
}

export const getErrorMsg = (error) => {
    if (error.response && error.response.data) {
        let errorMsg = "";
        for (const [_, value] of Object.entries(error.response.data)) {
            errorMsg += value.toString() + "  "
        }
        return errorMsg;
    }
    return "Please try again later!"

}