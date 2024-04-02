``` mermaid
sequenceDiagram
    title Ejercicio 0.6
    
    participant browser
    participant server

    note over browser: Click "Save"

    note over browser: onsubmit listener fires

    note over browser: note is pushing to existing array

    browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: [{ "content": "kyrie eleison", "date": "2023-1-1" }, ... ]
    deactivate server


```