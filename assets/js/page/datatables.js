'use strict'

const DataTable = function () {
    function example1() {
        $('#example').DataTable();
    }
    function example2() {
        let table = $('#example2').DataTable({
            responsive: true
        });
    }
    return {
        init: function () {
            example1()
            example2()
        }
    }
}()