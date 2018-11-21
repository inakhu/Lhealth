angular.module('htsApp.constants', [])

    .constant('APP_SERVER',{
        url:'http://localhost:8081/HEZECOM/Lagoshealth/application/api/',
        lurl:'http://localhost:8081/HEZECOM/Lagoshealth/application/api/',
        wurl:'http://localhost:8081/HEZECOM/Lagoshealth/application/api/',
        apikey:'HTSNFAPP'
    })

    .constant('USER_VARS', {
        myname: localStorage.getItem("myname"),
        myusername: localStorage.getItem("myusername"),
        mytoken: localStorage.getItem("mytoken"),
        myuserid: localStorage.getItem("myuserid"),
        myposition: localStorage.getItem("myposition"),
        uData:localStorage.getItem("myusername")+'/'+localStorage.getItem("mytoken")
    })

    .constant('USER_ROLES', {
        sadmin: 'sadmin_role',
        admin: 'admin_role',
        doctor: 'doctor_role',
        patient: 'patient_role'
    });