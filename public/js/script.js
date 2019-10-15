function validateAddNew() {

    var formFields = document.querySelectorAll(".value");
    var total = document.getElementsByName("tokimonTotal");
    var i;
     console.log(formFields[0].value);

     for(i=0; i<formFields.length; i++) {
         if(formFields[i].value == "") {
             alert("One or more fields are empty!");
             return false;
            }
        }
        
        for(i=1; i<9; i++) {
            if(!parseInt(formFields[i].value)) {
                console.log(i);
                console.log(formFields[i].value);
                alert("One or more of the attributes are not integer!");
                return false;
            }
        }
        
        for(i=1; i<9; i++) {
            if(parseInt(formFields[i].value) < 0 || parseInt(formFields[i].value) > 100) {
                console.log(i);
                console.log(formFields[i].value);
                alert("One or more of the attributes are out of range!");
                return false;
            }
        }

        total.value = 0;
        for(i=1; i<9; i++) {
            total.value = parseInt(formFields[i].value) + total.value;
        }
}

function confirmDelete() {
    var r = confirm("Are you sure you want to delete!");
}

function confirmModify() {
    var r = confirm("Are you sure you want to modify!");
}
