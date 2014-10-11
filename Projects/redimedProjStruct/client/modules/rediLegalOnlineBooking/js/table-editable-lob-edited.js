var TableEditable = function () {

    var handleTable = function () {



        var table = $('#sample_editable_1');

        var oTable = table.dataTable({
            "bFilter" : true,
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            //set the initial value
            "pageLength": 10,

            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{ // set default column settings
                'orderable': false,
                'targets': [1,2]
            }, {
                "searchable": false
            }],
            "order": [
                [0, "desc"]

            ]
            //set first column as a default sort by asc
        }).columnFilter({
            sPlaceHolder: "head:before",
            aoColumns: [
                { type: "text" },
                { type: "text" },
                { type: "select" },
                { type: "date-range" },
                { type: "date-range" }
            ]
        });;
    }

    return {

        //main function to initiate the module
        init: function () {
            handleTable();
        }

    };

}();