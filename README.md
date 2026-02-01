# Aplicación de Mantenimiento Vehicular

Esta aplicación permite a los asesores de servicio cotizar mantenimientos de vehículos (Hyundai) de forma rápida y dinámica.

## 💾 ¿Se guardan mis datos?
**SÍ**. La aplicación guarda automáticamente toda la configuración (precios, horas, recetas, nuevos repuestos) en la **memoria de tu navegador** (Local Storage).

*   **Nota Importante:** Si abres la aplicación en *otro* navegador o en *otro* computador, los datos no estarán ahí. Debes usar siempre el mismo navegador.
*   Si borras el historial/caché del navegador, es posible que se pierdan los datos.

## 🚀 ¿Cómo abrir la aplicación?

Como esta es una aplicación en desarrollo (modo local), necesitas seguir estos pasos para iniciarla si cierras la ventana:

1.  Abre la carpeta del proyecto en tu computador.
2.  Abre una terminal (PowerShell o CMD) en esa carpeta.
3.  Escribe el siguiente comando y presiona Enter:
    ```bash
    npm run dev
    ```
4.  Verás que aparece una dirección local, usualmente:
    `http://localhost:5173/`
5.  Mantén presionada la tecla `Ctrl` y haz clic en ese enlace, o cópialo y pégalo en tu navegador (Chrome/Edge).

## ✨ Funcionalidades Clave

*   **Asesor:** Selección de vehículo, mantenimiento y visualización de costos.
*   **Adicionales Dinámicos:** Sugiere automáticamente repuestos/mano de obra del catálogo que *no* están incluidos en la rutina seleccionada.
*   **Venta Cruzada:** Lista de precios fijos configurables.
*   **Panel Admin:**
    *   **Configurador Inteligente:** Al configurar el mantenimiento de **10.000 KM**, se aplica automáticamente a 30k, 70k y 90k. Lo mismo para **20.000 KM** (aplica a 40k, 60k, 80k).
    *   Gestión de Precios Globales (Hora MO, Insumos).
    *   CRUD (Crear/Leer/Editar/Borrar) de items de catálogo y venta cruzada.
