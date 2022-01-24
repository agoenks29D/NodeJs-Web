import Swal from 'sweetalert2';
import i18next from 'i18next';
import CoreClass from './class/Core';
import ServiceWorkerClass from './class/ServiceWorker';
import RESTful from './RESTful';

// const iinit = i18next.init({
// 	initImmediate: false,
// 	fallbackLng: 'eng',
// 	lng: 'eng',
// 	debug: true,
// 	ns: 'web',
// 	defaultNS: 'web',
// 	saveMissing: true,
// 	updateMissing: true,
// 	saveMissingTo: 'current'
// });

// console.log(iinit)

export default function (config) {
	return new Promise((resolve, reject) => {
		var SERVER = (process.env.NODE_ENV == 'development')?'http://':'https://';
		SERVER = SERVER+process.env.HOST+':'+process.env.PORT
		const Core = new CoreClass(Object.assign({ SERVER: 'SERVER_URL' }, config));
		Core.auth().then(autenticated => {

			const Service_Worker = new ServiceWorkerClass(Core.config(), autenticated.data);
			const Data = {};

			if (autenticated.valid) {

				// service worker has control to page
				if (Service_Worker.on_control()) {

				}

				Data.ServiceWorker = Service_Worker;
				Data.RESTful = RESTful;
				Data.RESTfulUser = Core.RESTful();
				Data.Swal = Swal;
				Data.Helpers = Core.helpers();

				resolve(Data);
			} else {
				reject(autenticated.error);
			}
		}, reject);
	});
}
