console.log("library.js is loading");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired in library.js");

    const saveVersionButton = document.getElementById('saveVersionButton');
    const libraryButton = document.getElementById('libraryButton');
    const libraryModal = document.getElementById('libraryModal');
    const closeLibraryModalButton = document.getElementById('closeLibraryModal');
    const libraryList = document.getElementById('libraryList');

    console.log("Save version button:", saveVersionButton);
    console.log("Library button:", libraryButton);
    console.log("Library modal:", libraryModal);
    console.log("Close library modal button:", closeLibraryModalButton);
    console.log("Library list:", libraryList);

    if (!saveVersionButton || !libraryButton || !libraryModal || !closeLibraryModalButton || !libraryList) {
        console.error("One or more required elements are missing in the DOM");
        return;
    }

    function saveVersion() {
        console.log("Saving version");
        const currentVersion = JSON.stringify(window.lyrics);
        const versions = JSON.parse(localStorage.getItem('lyricsVersions')) || [];
        const title = document.getElementById('title').textContent;
        versions.push({
            date: new Date().toLocaleString(),
            title: title,
            lyrics: currentVersion
        });
        localStorage.setItem('lyricsVersions', JSON.stringify(versions));
        console.log("Version saved, total versions:", versions.length);
        updateLibraryList();
        showNotification('Version sauvegardée avec succès !');
    }

    function openLibraryModal() {
        console.log("Opening library modal");
        libraryModal.style.display = 'block';
        updateLibraryList();
    }

    function closeLibraryModalFunc() {
        console.log("Closing library modal");
        libraryModal.style.display = 'none';
    }

    function updateLibraryList() {
        console.log("Updating library list");
        libraryList.innerHTML = '';
        const versions = JSON.parse(localStorage.getItem('lyricsVersions')) || [];
        console.log("Total versions found:", versions.length);
        versions.forEach((version, index) => {
            const li = document.createElement('li');
            li.textContent = `${version.title} - Version ${index + 1} - ${version.date}`;
            
            const loadButton = document.createElement('button');
            loadButton.textContent = 'Charger';
            loadButton.onclick = () => loadVersion(index);
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = () => deleteVersion(index);
            
            li.appendChild(loadButton);
            li.appendChild(deleteButton);
            libraryList.appendChild(li);
        });
    }

    function loadVersion(index) {
        console.log("Attempting to load version", index);
        const versions = JSON.parse(localStorage.getItem('lyricsVersions')) || [];
        if (versions[index]) {
            console.log("Version found, loading...");
            window.lyrics = JSON.parse(versions[index].lyrics);
            closeLibraryModalFunc();
            if (typeof window.displayLyrics === 'function') {
                window.displayLyrics();
                console.log("Lyrics display updated");
            } else {
                console.error("window.displayLyrics is not a function");
            }
            if (typeof window.updateStatus === 'function') {
                window.updateStatus('Version chargée');
                console.log("Status updated");
            } else {
                console.error("window.updateStatus is not a function");
            }
            showNotification('Version chargée avec succès !');
        } else {
            console.error("Version not found at index", index);
            showNotification('Erreur : Version non trouvée', 'error');
        }
    }

    function deleteVersion(index) {
        const versions = JSON.parse(localStorage.getItem('lyricsVersions')) || [];
        versions.splice(index, 1);
        localStorage.setItem('lyricsVersions', JSON.stringify(versions));
        updateLibraryList();
        showNotification('Version supprimée avec succès !');
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    function debugStorage() {
        const versions = JSON.parse(localStorage.getItem('lyricsVersions')) || [];
        console.log("All saved versions:", versions);
    }

    saveVersionButton.addEventListener('click', saveVersion);
    libraryButton.addEventListener('click', openLibraryModal);
    closeLibraryModalButton.addEventListener('click', closeLibraryModalFunc);

    // Ajouter le bouton de débogage
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Debug Storage';
    debugButton.onclick = debugStorage;
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.left = '10px';
    document.body.appendChild(debugButton);

    console.log("library.js loaded successfully and all event listeners set up");
});