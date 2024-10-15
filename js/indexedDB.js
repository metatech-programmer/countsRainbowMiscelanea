let db;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CountsMiscelanea', 1);

        request.onerror = (event) => {
            reject('Error al abrir la base de datos');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            const objectStore = db.createObjectStore('counts', { keyPath: 'id' });
            objectStore.createIndex('date', 'date', { unique: false });
            objectStore.createIndex('type', 'type', { unique: false });
        };
    });
}

function addCount(count) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['counts'], 'readwrite');
        const objectStore = transaction.objectStore('counts');
        const request = objectStore.add(count);

        request.onerror = (event) => {
            reject('Error al agregar el registro');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

function getAllCounts() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['counts'], 'readonly');
        const objectStore = transaction.objectStore('counts');
        const request = objectStore.getAll();

        request.onerror = (event) => {
            reject('Error al obtener los registros');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

function deleteCount(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['counts'], 'readwrite');
        const objectStore = transaction.objectStore('counts');
        const request = objectStore.delete(id);

        request.onerror = (event) => {
            reject('Error al eliminar el registro');
        };

        request.onsuccess = (event) => {
            resolve();
        };
    });
}

function getCountsByMonth(year, month) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['counts'], 'readonly');
        const objectStore = transaction.objectStore('counts');
        const index = objectStore.index('date');
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
        const range = IDBKeyRange.bound(startDate, endDate);
        const request = index.getAll(range);

        request.onerror = (event) => {
            reject('Error al obtener los registros del mes');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

function getCountsByDay(date) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['counts'], 'readonly');
        const objectStore = transaction.objectStore('counts');
        const index = objectStore.index('date');
        const request = index.getAll(date);

        request.onerror = (event) => {
            reject('Error al obtener los registros del día');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

function getCountsByYear(year) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['counts'], 'readonly');
        const objectStore = transaction.objectStore('counts');
        const index = objectStore.index('date');
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        const range = IDBKeyRange.bound(startDate, endDate);
        const request = index.getAll(range);

        request.onerror = (event) => {
            reject('Error al obtener los registros del año');
        };

        request.onsuccess = (event) => {    
            resolve(event.target.result);
        };
    });
}