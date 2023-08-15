function getOffset(currentPage = 1, listPerPage) {
	return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
	if (!rows) {
		return [];
	}
	return rows;
}

function jsonToInsertQuery(jsonObj, tableName) {
    if(!jsonObj) {
        return '';
    }
    let query = `Insert into ${tableName} (${Object.keys(jsonObj).join(', ')}) values (`
    Object.keys(jsonObj).forEach(obj => {
        query = query + "'" + jsonObj[obj] + "', ";
    })
    return query.substring(0,query.length-2) + ')';
}

module.exports = {
	getOffset,
	emptyOrRows,
    jsonToInsertQuery
};
