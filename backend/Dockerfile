FROM python:3.12-slim

# 1. Inyección del binario de uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 2. Configuración de variables de entorno para uv
# Forzamos a uv a que compile el bytecode para un arranque más rápido
ENV UV_COMPILE_BYTECODE=1
# Evitamos que uv se actualice a sí mismo o busque dependencias no fijadas
ENV UV_LINK_MODE=copy
ENV UV_PYTHON_DOWNLOADS=never

WORKDIR /backend

# 3. Caché de capas estricto: Copiamos SOLO los archivos de definición
COPY pyproject.toml uv.lock ./

# 4. Instalación de dependencias (Capa cacheada)
# --frozen: Falla si uv.lock no está sincronizado con pyproject.toml (seguridad).
# --no-install-project: Instala las librerías, pero NO tu código aún. 
# --no-dev: Excluye dependencias de desarrollo (pytest, ruff, etc.) para producción.
RUN uv sync --frozen --no-install-project --no-dev

# 5. Copiamos el resto del código fuente
COPY . .

# 6. Sincronización final del proyecto
# Esto instala tu propia aplicación dentro del entorno de uv
RUN uv sync --frozen --no-dev

# 7. Exponemos el entorno virtual al sistema
# uv crea automáticamente un entorno en /backend/.venv
# Al añadirlo al PATH, los comandos como 'uvicorn' se ejecutarán desde allí
ENV PATH="/backend/.venv/bin:$PATH"

# 8. Seguridad: Usuario sin privilegios
RUN useradd -m appuser
USER appuser

EXPOSE 8000
CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]