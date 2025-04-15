document.addEventListener('DOMContentLoaded', function() {
    const csvFileInput = document.getElementById('csvFile');
    const uploadBtn = document.getElementById('uploadBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusMessage = document.getElementById('statusMessage');
    const downloadSection = document.getElementById('downloadSection');
    
    let currentReportId = null;
    
    uploadBtn.addEventListener('click', handleUpload);
    downloadBtn.addEventListener('click', handleDownload);
    
    function handleUpload() {
        const file = csvFileInput.files[0];
        
        if (!file) {
            showStatus('Пожалуйста, выберите CSV файл', 'error');
            return;
        }
        
        if (!file.name.endsWith('.csv')) {
            showStatus('Файл должен быть в формате CSV', 'error');
            return;
        }
        
        uploadBtn.disabled = true;
        showStatus('Обработка файла...', 'info');
        
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('/api/reports/upload/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            currentReportId = data.id;
            showStatus('Файл успешно обработан!', 'success');
            downloadSection.classList.remove('hidden');
        })
        .catch(error => {
            const errorMsg = error.error || 'Произошла ошибка при обработке файла';
            showStatus(errorMsg, 'error');
        })
        .finally(() => {
            uploadBtn.disabled = false;
        });
    }
    
    function handleDownload() {
        if (!currentReportId) return;
        
        window.open(`/api/reports/download/${currentReportId}/`, '_blank');
    }
    
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        statusMessage.classList.remove('hidden');
    }
});