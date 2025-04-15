document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready'); // Debug
    
    // Получаем элементы
    const csvFileInput = document.getElementById('csvFile');
    const uploadBtn = document.getElementById('uploadBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusMessage = document.getElementById('statusMessage');
    const downloadSection = document.getElementById('downloadSection');
    
    // Проверяем, что все элементы найдены
    if (!csvFileInput || !uploadBtn || !statusMessage || !downloadSection || !downloadBtn) {
        console.error('One or more elements not found!');
        return;
    }
    
    let currentReportId = null;
    
    // Функция для получения CSRF токена
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }
    
    // Обработчик загрузки файла
    uploadBtn.addEventListener('click', function() {
        console.log('Upload button clicked'); // Debug
        
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
            console.log('Upload success:', data); // Debug
            currentReportId = data.id;
            showStatus('Файл успешно обработан! ID: ' + data.id, 'success');
            downloadSection.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Upload error:', error); // Debug
            const errorMsg = error.error || 'Произошла ошибка при обработке файла';
            showStatus(errorMsg, 'error');
        })
        .finally(() => {
            uploadBtn.disabled = false;
        });
    });
    
    // Обработчик скачивания файла
    downloadBtn.addEventListener('click', function() {
        if (!currentReportId) {
            showStatus('Нет доступного отчета для скачивания', 'error');
            return;
        }
        
        // Самый надежный способ скачивания
        const link = document.createElement('a');
        link.href = `/media/reports/report_${currentReportId}.docx`;
        link.download = `road_report_${currentReportId}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Функция для отображения статуса
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        statusMessage.style.display = 'block';
        
        // Автоматическое скрытие через 5 секунд
        if (type !== 'info') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Debug: проверяем доступность кнопки
    console.log('Upload button state:', uploadBtn.disabled);
});