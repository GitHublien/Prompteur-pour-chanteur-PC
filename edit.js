console.log("edit.js is loading");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired in edit.js");

    const editButton = document.getElementById('editButton');
    const editModal = document.getElementById('editModal');
    const closeEditModalButton = document.getElementById('closeEditModal');
    const editForm = document.getElementById('editForm');

    if (!editButton || !editModal || !closeEditModalButton || !editForm) {
        console.error("One or more required elements are missing in the DOM");
        return;
    }

    function openEditModalFunc() {
        console.log("Opening edit modal");
        editModal.style.display = 'block';
        populateEditForm();
    }

    function closeEditModalFunc() {
        console.log("Closing edit modal");
        editModal.style.display = 'none';
    }

    function populateEditForm() {
        console.log("Populating edit form");
        editForm.innerHTML = '';

        const instructions = document.createElement('div');
        instructions.className = 'edit-instructions';
        instructions.innerHTML = `
            <h3>Personnalisez votre chanson</h3>
            <p>• Modifiez le titre principal et le nom de l'auteur</p>
            <p>• Ajoutez, renommez ou supprimez des parties</p>
            <p>• Éditez les paroles de chaque partie</p>
            <p>• Choisissez une couleur pour chaque partie</p>
        `;
        editForm.appendChild(instructions);

        const titleInput = createInput('text', 'Titre de la chanson', document.getElementById('title').textContent);
        const authorInput = createInput('text', 'Auteur', document.getElementById('subtitle').textContent);
        const saveTitleAuthorButton = createButton('Sauvegarder le titre et l\'auteur', saveTitleAndAuthor);

        editForm.appendChild(titleInput);
        editForm.appendChild(authorInput);
        editForm.appendChild(saveTitleAuthorButton);

        window.lyrics.forEach((lyric, index) => {
            const section = createLyricSection(lyric, index);
            editForm.appendChild(section);
        });

        const addButton = createButton('Ajouter une nouvelle partie', addLyricPart);
        addButton.className = 'add-part-button';
        editForm.appendChild(addButton);

        console.log("Edit form populated with", window.lyrics.length, "lyrics");
    }

    function createInput(type, placeholder, value) {
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.value = value || '';
        return input;
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = function(e) {
            e.preventDefault();
            onClick();
        };
        return button;
    }

    function createLyricSection(lyric, index) {
        const section = document.createElement('div');
        section.className = 'lyric-section';
        section.style.borderColor = lyric.color || '#000000';

        const titleInput = createInput('text', `Partie ${index + 1}`, lyric.title);
        titleInput.className = 'section-title';

        const textarea = document.createElement('textarea');
        textarea.value = lyric.text || '';
        textarea.rows = 4;
        textarea.style.color = lyric.color || '#000000';
        textarea.style.backgroundColor = getContrastColor(lyric.color || '#000000');

        const colorPickerContainer = document.createElement('div');
        colorPickerContainer.className = 'color-picker-container';
        
        const paletteLabel = document.createElement('p');
        paletteLabel.textContent = 'Choisissez la couleur pour le texte :';
        paletteLabel.style.marginBottom = '10px';
        
        const colorPalette = createColorPalette(section, textarea);
        const hueSlider = createHueSlider(section, textarea);
        
        colorPickerContainer.appendChild(paletteLabel);
        colorPickerContainer.appendChild(colorPalette);
        colorPickerContainer.appendChild(hueSlider);

        const saveButton = createButton('Sauvegarder', () => saveLyricPart(index));
        const deleteButton = createButton('Supprimer', () => deleteLyricPart(index));

        section.appendChild(titleInput);
        section.appendChild(textarea);
        section.appendChild(colorPickerContainer);
        section.appendChild(saveButton);
        section.appendChild(deleteButton);

        return section;
    }

    function createColorPalette(section, textarea) {
        const palette = document.createElement('div');
        palette.className = 'color-palette';
        
        const colors = [
            '#006400', '#66CDAA', '#008080', '#4682B4', '#87CEEB', '#708090', '#8FBC8F',
            '#FAEBD7', '#B0C4DE', '#FFD700', '#696969', '#F0F8FF', '#A9A9A9', '#F5F5DC',
            '#2F4F4F', '#D3D3D3', '#A0522D', '#FFF0F5', '#C0C0C0', '#DEB887', '#FFB6C1',
            '#FFA07A', '#FF69B4', '#E0FFFF', '#F5DEB3', '#8B4513', '#FFC0CB', '#000000',
            '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF',
            '#800000', '#808000', '#008000', '#800080', '#008080', '#000080', '#FFA500',
            '#FA8072', '#FFC0CB', '#FFE4B5', '#F0E68C', '#98FB98', '#ADD8E6', '#DDA0DD'
        ];

        const rows = 7; // Nombre de rangées
        const colsOdd = 7; // Nombre de colonnes pour les rangées impaires
        const colsEven = 6; // Nombre de colonnes pour les rangées paires

        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'color-row';
            const cols = i % 2 === 0 ? colsOdd : colsEven;
            
            for (let j = 0; j < cols; j++) {
                const colorIndex = i * colsOdd + j;
                if (colorIndex < colors.length) {
                    const colorOption = document.createElement('div');
                    colorOption.className = 'color-option';
                    colorOption.style.backgroundColor = colors[colorIndex];
                    colorOption.onclick = () => setColor(section, textarea, colors[colorIndex]);
                    row.appendChild(colorOption);
                }
            }
            
            palette.appendChild(row);
        }

        return palette;
    }

    function createHueSlider(section, textarea) {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '360';
        slider.value = '0';
        slider.className = 'hue-slider';
        slider.oninput = (e) => {
            const hue = e.target.value;
            const color = `hsl(${hue}, 100%, 50%)`;
            setColor(section, textarea, color);
        };
        return slider;
    }

    function setColor(section, textarea, color) {
        section.style.borderColor = color;
        textarea.style.color = color;
        textarea.style.backgroundColor = getContrastColor(color);
    }

    function getContrastColor(hexcolor) {
        // Convertir la couleur hex en RGB
        const r = parseInt(hexcolor.slice(1, 3), 16);
        const g = parseInt(hexcolor.slice(3, 5), 16);
        const b = parseInt(hexcolor.slice(5, 7), 16);
        
        // Calculer la luminosité
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Choisir le fond en fonction de la luminosité
        return luminance > 0.5 ? '#f0f0e0' : '#2f2f2f';
    }

    function saveTitleAndAuthor() {
        const titleInput = editForm.querySelector('input[placeholder="Titre de la chanson"]');
        const authorInput = editForm.querySelector('input[placeholder="Auteur"]');
        
        document.getElementById('title').textContent = titleInput.value;
        document.getElementById('subtitle').textContent = authorInput.value;
        
        showNotification('Titre et auteur sauvegardés avec succès !');
    }

    function saveLyricPart(index) {
        const section = editForm.querySelectorAll('.lyric-section')[index];
        const titleInput = section.querySelector('.section-title');
        const text = section.querySelector('textarea').value;
        const color = section.style.borderColor;

        let title = titleInput.value;
        if (!title.startsWith(`Partie ${index + 1}`)) {
            title = `Partie ${index + 1} - ${title}`;
        }

        window.lyrics[index] = { title, text, color, duration: window.lyrics[index].duration };
        console.log(`Updated lyric ${index}:`, window.lyrics[index]);
        showNotification('Partie sauvegardée avec succès !');

        titleInput.value = title;
    }

    function deleteLyricPart(index) {
        if (window.lyrics.length > 1) {
            window.lyrics.splice(index, 1);
            for (let i = index; i < window.lyrics.length; i++) {
                let title = window.lyrics[i].title;
                let newTitle = `Partie ${i + 1}`;
                if (title.includes(' - ')) {
                    newTitle += ' - ' + title.split(' - ')[1];
                }
                window.lyrics[i].title = newTitle;
            }
            populateEditForm();
            showNotification('Partie supprimée avec succès !');
        } else {
            showNotification('Impossible de supprimer la dernière partie.', 'error');
        }
    }

    function addLyricPart() {
        const newPartNumber = window.lyrics.length + 1;
        window.lyrics.push({ 
            title: `Partie ${newPartNumber}`, 
            text: '', 
            color: '#FFFFFF',
            duration: 10
        });
        populateEditForm();
        showNotification('Nouvelle partie ajoutée !');
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        editForm.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    editModal.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModalFunc();
        }
    });

    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
    });

    editButton.addEventListener('click', openEditModalFunc);
    closeEditModalButton.addEventListener('click', closeEditModalFunc);

    console.log("edit.js loaded successfully and all event listeners set up");
});