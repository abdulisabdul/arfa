'use strict'

const pop = document.querySelectorAll('[data-bs-toggle="popover"]')
pop.forEach(function (e) {
    new bootstrap.Popover(e, {
        container: 'body'
    })
});
const tooltip = document.querySelectorAll('[data-bs-toggle="tooltip"]')
tooltip.forEach(function (e) {
    new bootstrap.Tooltip(e)
});
// var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//   return new bootstrap.Tooltip(tooltipTriggerEl)
// })