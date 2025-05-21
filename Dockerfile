# ---------- Build Stage ----------
FROM node:22.14 AS builder

# Working directory
WORKDIR /app

# Disable husky during Docker build
ENV HUSKY=0

# Add a dummy DATABASE_URL for Prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma client without running migrations during build
RUN npx prisma generate && \
    npm run build

# ---------- Production Stage ----------
FROM node:22.14 AS production

# Working directory
WORKDIR /app

# Create a non-root user
RUN addgroup --system appuser && adduser --system --ingroup appuser appuser

# Copy dependency definitions
COPY package*.json ./

# Clean up prepare script and install only production deps
RUN npm pkg delete scripts.prepare && \
    npm ci --omit=dev

# Copy Prisma schema (for migrations if needed)
COPY prisma ./prisma/

# Copy build output and Prisma client from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma


# Create uploads directory and set permissions
RUN mkdir -p /app/logs /app/uploads && \
    chown -R appuser:appuser /app


# Expose the application port
EXPOSE 9000

# Run as non-root user 
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9000/health || exit 1

# Run the application with environment variables set at runtime
CMD ["node", "dist/server.js"]