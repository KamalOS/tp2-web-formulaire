document.addEventListener('DOMContentLoaded', () => {
    // 1. Validation de l'âge (18 ans minimum)
    const dateInput = document.getElementById('date_naissance');
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const formattedMaxDate = maxDate.toISOString().split('T')[0];
    dateInput.max = formattedMaxDate;

    // 2. Messages d'erreur personnalisés (Validation HTML5 via setCustomValidity)
    const formOptions = {
        nom: "Veuillez saisir votre nom.",
        prenom: "Veuillez saisir votre prénom.",
        email: "Veuillez entrer une adresse e-mail valide.",
        telephone: "Format attendu: commençant par 0 ou +33 (ex: 0612345678).",
        date_naissance: "Vous devez avoir au moins 18 ans pour vous inscrire.",
        password: "Le mot de passe doit contenir min 8 caractères, 1 majuscule, 1 chiffre.",
        pays: "Veuillez sélectionner ou saisir votre pays.",
        cgu: "Vous devez accepter les conditions générales.",
        genre: "Veuillez sélectionner votre genre."
    };

    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        // Ajouter une classe pour le style CSS personnalisé après interaction
        input.addEventListener('blur', () => {
            input.classList.add('touched');
        });
        
        // Réinitialiser la validation personnalisée pendant la frappe
        input.addEventListener('input', () => {
            input.setCustomValidity('');
            
            // Logique de vérification pour la confirmation du mot de passe
            if (input.id === 'password_confirm' || input.id === 'password') {
                const password = document.getElementById('password').value;
                const confirmInput = document.getElementById('password_confirm');
                
                if (password !== confirmInput.value && confirmInput.value !== '') {
                    confirmInput.setCustomValidity("Les mots de passe ne correspondent pas.");
                } else {
                    confirmInput.setCustomValidity('');
                }
            }
        });

        // Définir le message personnalisé lorsque le champ est invalide
        input.addEventListener('invalid', function (e) {
            this.classList.add('touched');
            
            if (this.value === '' && this.hasAttribute('required')) {
                if (this.type === 'radio') {
                    this.setCustomValidity(formOptions.genre);
                } else if (this.type === 'checkbox' && this.name === 'cgu') {
                    this.setCustomValidity(formOptions.cgu);
                } else {
                    this.setCustomValidity('Ce champ est obligatoire.');
                }
            } else {
                if (this.id === 'password_confirm') {
                     this.setCustomValidity("Les mots de passe ne correspondent pas.");
                } else if (formOptions[this.name]) {
                    this.setCustomValidity(formOptions[this.name]);
                }
            }
        });
    });

    // 3. Compteur de caractères pour la biographie
    const bioTextarea = document.getElementById('biographie');
    const charCount = document.getElementById('char-count');
    
    if (bioTextarea) {
        bioTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    // 4. Affichage du nom du fichier photo de profil
    const fileInput = document.getElementById('photo_profil');
    const fileNameDisplay = document.querySelector('.file-upload-name');

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                fileNameDisplay.style.color = 'var(--text-main)';
            } else {
                fileNameDisplay.textContent = 'Aucun fichier sélectionné';
                fileNameDisplay.style.color = 'var(--text-muted)';
            }
        });
    }

    // 5. Animation visuelle lors d'une erreur de soumission
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        // Le navigateur gère nativement le blocage de la soumission si non valide
        // On se contente d'ajouter un effet "shake" aux champs invalides non cachés
        const invalidFields = form.querySelectorAll(':invalid');
        invalidFields.forEach(field => {
            const group = field.closest('.input-group') || field;
            group.classList.remove('shake');
            void group.offsetWidth; // Force reculcul -> relance l'animation
            group.classList.add('shake');
        });
    });
});
