const fs = require('fs');
const path = require('path');

/**
 * Get files in directory
 *
 * @param      {string}  directory              Directory path
 * @param      {string}  [return_type='array']  Return type array or object
 * @return     {array|object}
 */
module.exports.get_files = (directory, return_type = 'array') => {
	var files = (return_type == 'array')?new Array:new Object;
	fs.readdirSync(directory).filter(file => {
		if (path.basename(file).split('.').slice(0, -1).join('.') !== path.basename(__filename).split('.').slice(0, -1).join('.')) {
			return (file.slice(-3).match(/\.(js|ts)/));
		}
	}).forEach(file => {
		var file_name = [path.basename(file).split('.').slice(0, -1).join('.')];
		var file_path = require(path.join(directory, file));
		var response = { [file_name]: file_path };
		if (return_type == 'array') {
			files.push(response);
		} else {
			Object.assign(files, response);
		}
	});

	return files;
}
