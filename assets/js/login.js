'use strict'
const login = function () {

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation')



	// Loop over them and prevent submission
	Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})

	const seePassword = document.querySelectorAll('.password')
	seePassword.forEach(function (pass) {
		pass.addEventListener('click', function () {
			if (this.children[0].classList.contains('fa-eye')) {
				this.children[0].classList.remove('fa-eye')
				this.children[0].classList.add('fa-eye-slash')
				this.parentElement.children[0].setAttribute('type', 'text')
				return false;
			}
			this.children[0].classList.add('fa-eye')
			this.children[0].classList.remove('fa-eye-slash')
			this.parentElement.children[0].setAttribute('type', 'password')
		})
	})
}()