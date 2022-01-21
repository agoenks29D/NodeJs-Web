var WN = WebNode({
	ID: 'WN-1337'
}).then(resource => {
	window.API = resource.RESTful(localStorage.getItem('token'));
	$('#sign-in').on('submit', (e) => {
		e.preventDefault();
		API.user.sign_in($('#sign-in-identity').val(), $('#sign-in-password').val()).then(user => {
			$('p.login-box-msg').text('authentication success').css('color', 'green');
			var Toast = resource.Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500
			});

			Toast.fire({
				icon: 'success',
				title: 'Authentication success',
			}).then(() => window.location.href = window.location.origin+'/'+window.location.pathname.split('/')[1]+'/')
		}).catch(error => {
			const error_status = error.toJSON().status;
			if (error_status == 401) {
				$('p.login-box-msg').text('authentication failed').css('color', 'red');
			} else {
				console.log(error);
			}
		});
	});
}, console.log);
