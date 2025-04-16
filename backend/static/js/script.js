document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready');
    
    const csvFileInput = document.getElementById('csvFile');
    const uploadBtn = document.getElementById('uploadBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusMessage = document.getElementById('statusMessage');
    const downloadSection = document.getElementById('downloadSection');
    
    if (!csvFileInput || !uploadBtn || !statusMessage || !downloadSection || !downloadBtn) {
        console.error('One or more elements not found!');
        return;
    }
    
    let currentReportId = null;
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }
    uploadBtn.addEventListener('click', function() {
        console.log('Upload button clicked');
        
        const file = csvFileInput.files[0];
        if (!file) {
            showStatus('Пожалуйста, выберите CSV файл', 'error');
            return;
        }
        
        if (!file.name.toLowerCase().endsWith('.csv')) {
            showStatus('Файл должен быть в формате CSV', 'error');
            return;
        }
        
        uploadBtn.disabled = true;
        showStatus('Обработка файла...', 'info');
        
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('/api/reports/upload/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            console.log('Upload success:', data);
            currentReportId = data.id;
            showStatus('Файл успешно обработан! ID: ' + data.id, 'success');
            downloadSection.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Upload error:', error);
            const errorMsg = error.error || 'Произошла ошибка при обработке файла';
            showStatus(errorMsg, 'error');
        })
        .finally(() => {
            uploadBtn.disabled = false;
        });
    });
    downloadBtn.addEventListener('click', function() {
        if (!currentReportId) {
            showStatus('Нет доступного отчета для скачивания', 'error');
            return;
        }
        const link = document.createElement('a');
        link.href = `/media/reports/report_${currentReportId}.docx`;
        link.download = `road_report_${currentReportId}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        statusMessage.style.display = 'block';
        if (type !== 'info') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    console.log('Upload button state:', uploadBtn.disabled);
});