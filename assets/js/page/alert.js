'use strict'


// SWEET ALERT =========
const basic = document.getElementById('swall-basic')
basic.addEventListener('click', function () {
  Swal.fire('This basic alert')
})
const question = document.getElementById('swall-question')
question.addEventListener('click', function () {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to continue',
    icon: 'question',
    confirmButtonText: 'Ok'
  })
})
const success = document.getElementById('swall-success')
success.addEventListener('click', function () {
  Swal.fire({
    title: 'Great!!',
    text: 'Everytihing is fine',
    icon: 'success',
    confirmButtonText: 'Ok'
  })
})
const error = document.getElementById('swall-error')
error.addEventListener('click', function () {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    footer: '<a href>Why do I have this issue?</a>'
  })
})
const custom = document.getElementById('swall-custom')
custom.addEventListener('click', function () {
  Swal.fire({
    title: '<strong>HTML <u>example</u></strong>',
    icon: 'info',
    html: 'You can use <b>bold text</b>, ' +
      '<a href="http://sweetalert2.github.io">links</a> ' +
      'and other HTML tags',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
    cancelButtonAriaLabel: 'Thumbs down'
  })
})
const confirmation = document.getElementById('swall-confirmation')
confirmation.addEventListener('click', function () {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
})
const autoclose = document.getElementById('swall-auto-close')
autoclose.addEventListener('click', function () {
  let timerInterval
  Swal.fire({
    title: 'Auto close alert!',
    html: 'I will close in <b></b> milliseconds.',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      timerInterval = setInterval(() => {
        const content = Swal.getContent()
        if (content) {
          const b = content.querySelector('b')
          if (b) {
            b.textContent = Swal.getTimerLeft()
          }
        }
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  })
})

// ISI TOAST ========
const basicToast = document.getElementById('toast-basic')
basicToast.addEventListener('click', () => {
  iziToast.show({
    title: 'Hey',
    message: 'What would you like to add?',
    position: 'topRight'
  });
})
const successToast = document.getElementById('toast-success')
successToast.addEventListener('click', () => {
  iziToast.success({
    title: 'OK',
    message: 'Successfully inserted record!',
    position: 'topRight'
  });
})
const warningToast = document.getElementById('toast-warning')
warningToast.addEventListener('click', () => {
  iziToast.warning({
    title: 'Caution',
    message: 'You forgot important data',
    position: 'topRight'
  });
})
const errorToast = document.getElementById('toast-error')
errorToast.addEventListener('click', () => {
  iziToast.error({
    title: 'Error',
    message: 'Illegal operation',
    position: 'topRight'
  });
})
const bottomRightToast = document.getElementById('toast-bottom-right')
bottomRightToast.addEventListener('click', () => {
  iziToast.show({
    title: 'Hey',
    message: 'What would you like to add?',
    position: 'bottomRight'
  });
})
const bottomCenterToast = document.getElementById('toast-bottom-center')
bottomCenterToast.addEventListener('click', () => {
  iziToast.show({
    title: 'Hey',
    message: 'What would you like to add?',
    position: 'bottomCenter'
  });
})
const bottomLeftToast = document.getElementById('toast-bottom-left')
bottomLeftToast.addEventListener('click', () => {
  iziToast.show({
    title: 'Hey',
    message: 'What would you like to add?',
    position: 'bottomLeft'
  });
})
const topLeftToast = document.getElementById('toast-top-left')
topLeftToast.addEventListener('click', () => {
  iziToast.show({
    title: 'Hey',
    message: 'What would you like to add?',
    position: 'topLeft'
  });
})