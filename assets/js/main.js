$(document).ready(function () {

     // Initialize Firebase
    var config = {
    apiKey: "AIzaSyCfuDWDjOIhrrDx4al6ONoSoSNjfFpygoo",
    authDomain: "emanagement-43257.firebaseapp.com",
    databaseURL: "https://emanagement-43257.firebaseio.com",
    projectId: "emanagement-43257",
    storageBucket: "",
    messagingSenderId: "707210450275"
  };
    //Initialize the database
    firebase.initializeApp(config);
    // Create a variable to reference the database
    var db = firebase.database().ref('Employee');
    var myEmployee = {
        name: "",
        role: "",
        startDate: "",
        monthlyRate: 1243,
    };
    //-------- DATABASE ------------------------------
    db.on("child_added", function (childSnapshot) {
        var data = Object.values(childSnapshot.val());
        console.log(data);
        let [rate, name, role, startDate] = data;
        rate = parseInt(rate);

        var workedMonths = moment().diff(moment.unix(startDate, "X"), "months");
        var totalBilled = parseInt((workedMonths * rate));

        var name$           = $("<td>").text(name);
        var role$           = $("<td>").text(role);
        var startDate$      = $("<td>").text(moment(startDate,"X").format("DD/MM/YY"));
        var workMonths$     = $("<td>").text(workedMonths);
        var rate$           = $("<td>").text(formatDollar(rate));
        var totalBilled$    = $("<td>").text(formatDollar(totalBilled));
        var tBody = $("tbody");
        var tRow = $("<tr>");

        // var empBilled = empMonths * rate;

        // // // Append the newly created table data to the table row
        tRow.prepend(name$, role$, startDate$, workMonths$, rate$, totalBilled$);
        // // // Append the table row to the table body
        tBody.prepend(tRow);
        // Then include Firebase error logging
    },
        function (errorObject) {
            // In case of error this will print the error
            console.log("The read failed: " + errorObject.code);
    });

    $('#addEmployeeBtn').on('click', function (e) {
        var inputName = $("#empNameInput").val().trim();
        var inputRole = $("#empRoleInput").val().trim();
        var inputStartDate = moment($("#startDateInput").val().trim(), "DD/MM/YY").format("X");

        var empStartPretty = moment.unix(inputStartDate).format("MM/DD/YY");

        var inputRate = $("#rateInput").val().trim();
        myEmployee.name            = inputName;
        myEmployee.role            = inputRole;
        myEmployee.startDate       = inputStartDate;
        myEmployee.monthlyRate     = inputRate;
        console.log(myEmployee);
        db.push(myEmployee);
    });

    function formatDollar(num) {
        var p = num.toFixed(2).split(".");
        return "$" + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, "") + "." + p[1];
    }

});