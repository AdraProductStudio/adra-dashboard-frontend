const DATABASE_NAME = 'adra-qa-assessment-drafts';
const DATABASE_VERSION = 1;
const STORE_NAME = 'drafts';

const openDatabase = () => new Promise((resolve, reject) => {
    if (!window.indexedDB) {
        resolve(null);
        return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME, { keyPath: 'assessment_id' });
        }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

export const getQaAssessmentDraft = async (assessmentId) => {
    if (!assessmentId) return null;

    const database = await openDatabase();
    if (!database) return null;

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const request = transaction.objectStore(STORE_NAME).get(assessmentId);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
    });
};

export const saveQaAssessmentDraft = async ({ assessmentId, grids }) => {
    if (!assessmentId) return;

    const database = await openDatabase();
    if (!database) return;

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        transaction.objectStore(STORE_NAME).put({
            assessment_id: assessmentId,
            grids,
            updated_at: new Date().toISOString()
        });

        transaction.oncomplete = () => {
            database.close();
            resolve();
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
};

export const deleteQaAssessmentDraft = async (assessmentId) => {
    if (!assessmentId) return;

    const database = await openDatabase();
    if (!database) return;

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        transaction.objectStore(STORE_NAME).delete(assessmentId);

        transaction.oncomplete = () => {
            database.close();
            resolve();
        };
        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
};
