<p align="center">
  <a href="https://ataraxia-timer.onrender.com/" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1TuT30CiBkinh85WuTvjKGKN47hCyCS0Z" width="300" alt="Studios TKOH Logo">
  </a>
</p>

# Ataraxia Timer

**Desarrollado por Studios TKOH**

Centro de comando personal para la productividad. Un temporizador moderno diseñado para el trabajo profundo (Deep Work), estructurado con una arquitectura profesional de alto rendimiento.

<p align="center">
  <a href="https://ataraxia-timer.onrender.com/" target="_blank">
    <img src="https://github.com/VaCris/Ataraxia-Timer/blob/feature/pwa-offline-support/.codeviz/Diagram/Ataraxia.png?raw=true" width="900" alt="Diagrama de Arquitectura Ataraxia">
  </a>
</p>

## Actualización: Ataraxia V2 (Offline y Sincronización)

El núcleo de la aplicación ha sido reconstruido para ofrecer una experiencia robusta y confiable:

* **Soporte Offline (PWA):** Instalable como aplicación nativa en dispositivos móviles y de escritorio. Funciona sin conexión a internet mediante el uso de Service Workers.
* **Sincronización Inteligente:** Las tareas y configuraciones se sincronizan con la nube. En ausencia de conexión, los cambios se almacenan en una cola de salida (Outbox) y se procesan automáticamente al restablecerse el vínculo con el servidor.
* **Interfaz Optimista:** La gestión del Mission Log es instantánea. La interfaz de usuario refleja los cambios de inmediato sin depender de la latencia del servidor.
* **Persistencia de Estado:** Mediante la implementación de Redux Saga, el progreso del temporizador y las sesiones activas se mantienen íntegros ante recargas de página o cierres accidentales del navegador.

## Características

* **Modos de Enfoque:** Ciclos configurables para Trabajo, Descanso Corto y Descanso Largo.
* **Modo de Concentración:** Interfaz minimalista que oculta elementos secundarios durante los periodos de actividad.
* **Personalización Avanzada:**
    * **Temas:** Ajuste del color de acento global de la aplicación.
    * **Fondos:** Soporte para imágenes locales y URLs personalizadas.
* **Mission Log:** Sistema de gestión de objetivos con persistencia híbrida (Local/Nube).
* **Alertas:** Notificaciones acústicas al concluir los intervalos de tiempo.

## Tecnologías Utilizadas

* **React 18 & Vite:** Entorno de desarrollo y ejecución de alta velocidad.
* **Redux Toolkit:** Gestión centralizada del estado global.
* **Redux Saga:** Control de efectos secundarios y lógica de sincronización offline.
* **Vite PWA Plugin:** Gestión de manifiesto y estrategias de almacenamiento en caché.
* **Lucide React & GSAP:** Iconografía técnica y animaciones de interfaz.

## Instalación y Ejecución Local

1.  **Clonación del repositorio:**
    ```bash
    git clone [https://github.com/VaCris/Ataraxia-Timer.git](https://github.com/VaCris/Ataraxia-Timer.git)
    cd ataraxia-timer
    ```

2.  **Instalación de dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecución del entorno de desarrollo:**
    ```bash
    npm run dev
    ```

## Despliegue

La aplicación está optimizada para su despliegue en la plataforma **Render**.

**Configuración recomendada:**
* **Comando de construcción:** `npm install; npm run build`
* **Directorio de publicación:** `dist`

## Licencia

Este proyecto se distribuye bajo la **Licencia MIT**.

<p align="center">
  <sub>Desarrollado por <strong>Studios TKOH</strong></sub><br>
  <a href="https://studios-tkoh.azurewebsites.net/" target="_blank">studios-tkoh.azurewebsites.net</a>
</p>
