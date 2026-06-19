# Multi-service Python production runner image
FROM python:3.10-slim AS builder

WORKDIR /app

# Install system-level dependencies required for building C extensions (like rasterio/numpy)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgdal-dev \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.10-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy installed pip packages from builder stage
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Default entrypoint (will be overridden in docker-compose per service)
CMD ["uvicorn", "services.authentication-service.main:app", "--host", "0.0.0.0", "--port", "8000"]
