//----------------------- Declaration des variable global -----------------------//
const elements = {
    //container des fiture V2 de connexion/inscription ect..
    container: document.getElementById("LoginContainer"),
    //container des option de catégorie pro
    selectContainer: document.getElementById("selectCatList"),
    //Formulaire
    forms: {
        login: document.getElementById("formLogin"),
        register: document.getElementById("formRegister"),
        forgotPass: document.getElementById("formForgotPass"),
    },
    //display des boite Ecrand
    displays: {
        login: document.getElementById("displayLogin"),
        register: document.getElementById("displayRegister"),
        forgotPass: document.getElementById("displayForgotPass"),
        pub: document.getElementById("displayPub"),
        sendEmail: document.getElementById("displaySendEmail"),
        sendForgotPass: document.getElementById("displaySendForgotPass"),
    },
    //display des boite d'alert
    errors: {
        login: document.getElementById("ErrorLogin"),
        register: document.getElementById("ErrorRegister"),
        forgotPass: document.getElementById("ErrorForgotPass"),
    },
    buttons: {
        //boutton navigation
        nav: {
            login: document.getElementById("btnNavLogin"),
            register: document.getElementById("btnGoRegister"),
            forgotPass: document.getElementById("btnGoForgotPass"),
            exit: document.getElementById("btnNavExit"),
        },
        //bouton action d'abandon
        action: {
            login: document.getElementById("btnAbortLogin"),
            reg: document.getElementById("btnAbortReg"),
            forgotPass: document.getElementById("btnAbortForgotPass"),
            okSendEmail: document.getElementById("btnOkSendEmail"),
            okForgotPass: document.getElementById("btnOkForgotPass"),
        },
    },


};


//----------------------- Assignation des action aux boutton  -----------------------//
const abortBtns = [
    elements.buttons.action.login,
    elements.buttons.action.reg,
    elements.buttons.action.forgotPass,
    elements.buttons.action.okSendEmail,
    elements.buttons.action.okForgotPass

];
abortBtns.forEach(btn => {
    if (btn) btn.addEventListener("click", abortProccess);
});

if(elements.buttons.nav.exit){
    elements.buttons.nav.exit.addEventListener("click", disconnect)
};

if(elements.buttons.nav.login){ 
    elements.buttons.nav.login.addEventListener("click", function(){
        elements.displays.pub.style.display = "none";
        elements.container.style.display = "block";
        hideAllExcept("displayLogin");
    });
}

if(elements.buttons.nav.register){ 
    elements.buttons.nav.register.addEventListener("click", function(){
        hideAllExcept("displayRegister");
        updateCatPro();
    });
}

if(elements.buttons.nav.forgotPass){ 
    elements.buttons.nav.forgotPass.addEventListener("click", function(){
        hideAllExcept("displayForgotPass");
    });
}


//Tout les formulaire
if(elements.forms.login){ 
    elements.forms.login.addEventListener("submit", function(event){
        event.preventDefault(); // empeche l'envoi du formulaire
        let email = document.getElementById("coInputEmail").value;
        let password = document.getElementById("coInputMdp").value;
        connexionRequest(email, password);
    });
}

if(elements.forms.register){ 
    elements.forms.register.addEventListener("submit", function(event){
        event.preventDefault(); // empeche l'envoi du formulaire
        let select  = elements.selectContainer;
        let selectedOption = select.options[select.selectedIndex];
        let selectedCatPro = selectedOption.value;
        
        let email = document.getElementById("inputEmailReg").value;
        let nom = document.getElementById("inputNom").value;
        let prenom = document.getElementById("inputPrenom").value;
        let tel = document.getElementById("inputTelReg").value;
        let password = document.getElementById("inputRegpassword").value;
        let passwordConf = document.getElementById("inputRegpasswordRes").value; 
        sendRequestRegister(email, nom)

        // Vérifie la complexité du mot de passe
        if(checkPasswordComplexity(password) === false){
            elements.errors.register.style.display = "block";
            elements.errors.register.innerHTML = '<p class="m-0">- Mot de passe saisi n\'est pas assez complexe. Voir l\'aide </p>'
            return;
        }
        // Vérifie si les mots de passe saisis correspondent
        if(password != passwordConf){
            elements.errors.register.style.display = "block";
            elements.errors.register.innerHTML = '<p class="m-0">- Les mots de passes saisis ne correspondent pas</p>'            
            return;
        }
        // Vérifie si le numéro de téléphone est valide
        if(tel.length != 10){
            elements.errors.register.style.display = "block";
            elements.errors.register.innerHTML = '<p class="m-0">- Le num téléphone saisi n\'est pas valide. Voir l\'aide</p>' 
            return;
        }
        // Requête ajax pour vérifier les données
        $.ajax({
            url: "src/data.json",
            dataType: "json",
            success: function(data) {
                var registrationSent = false;
                let userExist = false;

                data.users.forEach(function(user) {
                    if(user.email === email){
                        elements.errors.register.style.display = "block";
                        elements.errors.register.innerHTML = '<p class="m-0">- Cet email existe déjà</p>'
                        userExist = true;
                        return;
                    }
                });

                data.registrations.forEach(function(registration) {
                    if (registration.email === email  && registration.lastName === nom && registration.firstName === prenom) {
                        registrationSent = true;
                    }
                });
                if(!userExist){
                    if (registrationSent) {
                        elements.errors.register.style.display = "block";
                        elements.errors.register.innerHTML = '<p class="m-0">- Demande d\'inscription déjà envoyée!</p>'
                        return;
                    } else {
                        elements.displays.register.style.display = "none";
                        elements.displays.sendEmail.style.display = "block";
                        return;
                    }
                }
            },
            error: function(error) {
                elements.errors.register.style.display = "block";
                elements.errors.register.innerHTML = '<p class="m-0">- Serveur indisponible</p>'
                console.log(error);
                return;
            }
        });

    })
}

if(elements.forms.forgotPass){ 
    elements.forms.forgotPass.addEventListener("submit", function(event){
        event.preventDefault(); // empeche l'envoi du formulaire
        let email = document.getElementById("inputUserEmail").value;
        let tel = document.getElementById("inputUserTel").value;
        let newPassword = document.getElementById("inputNvMdp").value;
        let passwordConf = document.getElementById("inputResNvMdp").value; 

        // Vérifie la complexité du mot de passe
        if(checkPasswordComplexity(newPassword) === false){
            elements.errors.forgotPass.style.display = "block";
            elements.errors.forgotPass.innerHTML = '<p class="m-0">- Mot de passe saisi n\'est pas assez complexe. Voir l\'aide </p>'
            return;
        }
        // Vérifie si les mots de passe saisis correspondent
        if(newPassword != passwordConf){
            elements.errors.forgotPass.style.display = "block";
            elements.errors.forgotPass.innerHTML = '<p class="m-0">- Les mots de passes saisis ne correspondent pas</p>'            
            return;
        }
        
        // Requête ajax pour vérifier les données
        $.ajax({
            url: "src/data.json",
            dataType: "json",
            success: function(data) {
                var forgotPassSent = false;
                userExist = false;

                data.users.forEach(function(user) {
                    if(user.email === email && user.phoneNumber === tel)
                    {
                        userExist = true;
                        return;
                    }
                });
    
                if(!userExist){
                    elements.errors.forgotPass.style.display = "block";
                    elements.errors.forgotPass.innerHTML = '<p class="m-0">- cet email ou ce no téléphone ne sont pas concordants</p>'    
                    return;
                }

                

                data.usersForgotPass.forEach(function(userForgotPass) {
                    if (userForgotPass.email === email  && userForgotPass.phoneNumber === tel) {
                        forgotPassSent = true;
                    }
                });

                if (forgotPassSent) {
                    elements.errors.forgotPass.style.display = "block";
                    elements.errors.forgotPass.innerHTML = '<p class="m-0">- Demande de nouveaux mot de passe déjà envoyée!</p>'
                    return;
                } else {
                    elements.displays.forgotPass.style.display = "none";
                    elements.displays.sendForgotPass.style.display = "block";
                    return;
                }
                
            },
            error: function(error) {
                elements.errors.forgotPass.style.display = "block";
                elements.errors.forgotPass.innerHTML = '<p class="m-0">- Serveur indisponible</p>'
                console.log(error);
                return;
            }
        });
    })
}


//----------------------- Tout les Function -----------------------//

/* 
*Fonction pour mettre a jours la list des catégorie professionnel 
*dans l'ecrand d'inscription depuis la basse de donné.
*/
function updateCatPro(){
    // Requête ajax pour vérifier les données
    $.ajax({
        url: "src/data.json",
        dataType: "json",
        success: function(data) {
            let optionsList = data.Professional_category_list;
            
            //Boucle sur tout les catégorie est creer les option dans l'html
            for (let i = 0; i < optionsList.length; i++) {
                let option = document.createElement("option");
                option.value = optionsList[i].codCP;
                option.text = optionsList[i].codCP + " - " + optionsList[i].libCP;
                elements.selectContainer.appendChild(option);
            }
        },
        error: function(error) {
            console.log(error);
            return;
        }
    });
}

// Verrifie la complexiter du mot de passe saisi
function checkPasswordComplexity(password) {
    // Au moins 8 caractères
    if (password.length < 8) {
        return false;
    }
    
    // Au moins une lettre minuscule
    if (!/[a-z]/.test(password)) {
        return false;
    }
    
    // Au moins une lettre majuscule
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    
    // Au moins un chiffre
    if (!/\d/.test(password)) {
        return false;
    }
    
    // Au moins un caractère spécial
    if (!/[!@#\$%\^&\*]/.test(password)) {
        return false;
    }
    
    return true;
}

// annule le proccess de en cour
function abortProccess() {
    elements.container.style.display = "none";
    elements.displays.login.style.display = "none";
    elements.displays.register.style.display = "none";
    elements.displays.forgotPass.style.display = "none";
    elements.errors.login.style.display = "none";
    elements.displays.sendEmail.style.display = "none";
    elements.displays.sendForgotPass.style.display = "none";
    elements.displays.pub.style.display = "block";
}

// Fonction pour cacher tous les blocks sauf celui spécifié
function hideAllExcept(elementId) {
    let elementsToHide = ["displayLogin", "displayRegister", "displayForgotPass"];
    elementsToHide.forEach(id => {
        if (id !== elementId) {
            document.getElementById(id).style.display = "none";
        }else{
            document.getElementById(id).style.display = "block";
        }
    });
}

// Effectue une requet AJAX pour Vérifie les id mdp saisi et retourn une reponse
function connexionRequest(email, password) {
    
    // Recherche dans la base de donné
    $.ajax({
        type: "GET",
        url: "src/data.json",
        dataType: "json",
        success: function(data) {
            let currentUser = null;
            // Recherche dans la base de donné si l'email est connu
            data.users.forEach(user => {
                if(email === user.email){
                    currentUser = user
                }
            });
            // Condition si utilisateur n'est pas inscrit ou que l'email est invalide
            if(currentUser === null){
                elements.errors.login.style.display = "block";
                elements.errors.login.innerHTML = '<p class="m-0"> - Compte client non trouvé, adresse mail invalide </p>'
            }
            // Condition si utilisateur entre les bonne information
            else if(currentUser.password === password){
                // Vérifie le role de l'utilisateur pour la connexion
                if(currentUser.role === 1){
                    connected(1); // connexion administrateur
                }
                else{
                    connected(0); // connexion client
                }
            }
            // Condition si utilisateur entre un mot de passe incorrect
            else{
                elements.errors.login.style.display = "block";
                elements.errors.login.innerHTML = '<p class="m-0"> - Mot de passe incorrect </p>'
            }
        },
        // si la requet ajax sur l'api n'abouti pas renvoie un message d'erreur
        error: function(error) { 
            elements.errors.login.style.display = "block";
            elements.errors.login.innerHTML = '<p class="m-0">- Serveur indisponible</p>'
            console.log(error);
            return;
        }
    });
    
};

// redirige vert la page personnel
function connected(role) { 
    if(role === 1){
        window.location.href = "http://127.0.0.1:5500/profilAdmin.html";
    }else{
        window.location.href = "http://127.0.0.1:5500/profilClient.html";
    }
 }
// redirige vert la page acceuil
function disconnect() {
    window.location.href = "http://127.0.0.1:5500/index.html";
}
 