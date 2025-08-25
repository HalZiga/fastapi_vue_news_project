# Новостной агрегатор

Простой сайт с новстями

## Предварительные требования

Для запуска проекта вам потребуются:

-   **Python**:
    Загрузите и установите с официального сайта Python версии 3.13.5 или выше: [https://www.python.org/downloads/](https://www.python.org/downloads/)

-   **Node.js**:
    Загрузите и установите с официального сайта (рекомендуется LTS-версия): [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

---

## Установка и запуск

Проект состоит из двух частей: бэкенда (FastAPI) и фронтенда (Vue.js).

## Все выполняется в cmd

### 1. Запуск бэкенда

1.  **Перейдите в папку бэкэнда:**
    ```bash
    cd FAPI
    ```
    

2.  **Создайте виртуальное окружение:**
    ```bash
    python -m venv .venv
    ```

3.  **Активируйте виртуальное окружение:**
    -   На Windows:
        ```bash
        .venv\Scripts\activate
        ```
    -   На macOS/Linux:
        ```bash
        source .venv/bin/activate
        ```

4.  **Установите зависимости Python:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Запустите сервер:**
    ```bash
    uvicorn main:app --reload
    ```
    Сервер будет доступен по адресу: `http://127.0.0.1:8000`

---

### 2. Запуск фронтенда

1.  **Перейдите в папку фронтенда:**
    ```bash
    cd frontend_folder_name
    ```

2.  **Установите зависимости Node.js:**
    ```bash
    npm install
    ```

3.  **Запустите dev-сервер:**
    ```bash
    npm run dev
    ```
    Dev-сервер будет доступен по адресу: `http://127.0.0.1:5173`.

### Логины и пароли для входа

1.  Админ
        login = admin
        password = adminpass
2.  Модератор
        login = "moderator"
        password = "moderpass"
3.  Пользователи
        login="reader1"
        password="reader1pass"

        login = "reader2"
        password = "reader2pass"


