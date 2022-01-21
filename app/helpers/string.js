
/**
 * Create random string
*/
module.exports.random_string = (length) => {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
	if (!length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}

	return str;
}

/**
 * String to boolean
 *
 * @param      {string}  str     String
 * @return     {boolean}
 */
module.exports.to_boolean = function(str) {
	switch(str.toLowerCase().trim()) {
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return Boolean(str);
	}
}
