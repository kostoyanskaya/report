# Django-проект: Система отчётов

Система для генерации и управления отчётами с REST API интерфейсом. Проект использует Django, DRF и развертывается с помощью Docker, Nginx и Gunicorn.

## Проект на сервере доступен:

Проект доступен по адресу: [http://45.90.33.93/](http://45.90.33.93/)

## Особенности

- REST API для работы с отчётами
- Загрузка файлов
- Готовый Docker-образ для быстрого развертывания
- Конфигурация для Nginx и Gunicorn

## Технологии

- Python 3.9
- Django 4.2
- Django REST Framework
- SQLite/PostgreSQL
- Docker
- Nginx
- Gunicorn

##  Для локальной установка

### 1. Клонирование репозитория
```
git clone git@github.com:kostoyanskaya/report.git

или

git clone https://github.com/kostoyanskaya/report.git
```


2. Переход в директорию report

```
cd report
```

3. Создание виртуального окружения

```
python -m venv venv
```

4. Активация виртуального окружения

```
source venv/Scripts/activate
```

5. Обновите pip

```
python -m pip install --upgrade pip
```

6. Установка зависимостей

```
pip install -r requirements.txt
```

7. Переход в директорию backend

```
cd backend
```

8. Создайте файл .env

```
Добавьте в него переменные
SECRET_KEY=django-insecure-your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=45.90.33.93,localhost,127.0.0.1
```

9. Применение миграций

```
python manage.py makemigrations
python manage.py migrate
```



10. Запуск проекта, введите команду

```
python manage.py runserver
```



## Автор
#### [_Виктория_](https://github.com/kostoyanskaya/)