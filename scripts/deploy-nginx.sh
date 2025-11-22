#!/bin/bash

# ==============================================================================
# nginx Configuration Deployment Script
# ==============================================================================
# This script deploys nginx configuration files from the repository to the
# system nginx directory and reloads nginx.
# ==============================================================================

set -e  # Exit on error

# Configuration
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NGINX_CONFIG_DIR="$REPO_DIR/nginx"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

echo "=========================================="
echo "nginx Configuration Deployment"
echo "=========================================="
echo ""

# Check if nginx config directory exists
if [ ! -d "$NGINX_CONFIG_DIR" ]; then
    echo "Error: nginx config directory not found: $NGINX_CONFIG_DIR"
    exit 1
fi

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then
    echo "Error: This script must be run with sudo"
    echo "Usage: sudo ./scripts/deploy-nginx.sh"
    exit 1
fi

# Copy nginx configuration files
echo "Step 1: Copying nginx configuration files..."
for conf_file in "$NGINX_CONFIG_DIR"/*.conf; do
    if [ -f "$conf_file" ]; then
        filename=$(basename "$conf_file")
        echo "  - Copying $filename to $NGINX_SITES_AVAILABLE/"
        cp "$conf_file" "$NGINX_SITES_AVAILABLE/"
    fi
done
echo ""

# Create symbolic links in sites-enabled
echo "Step 2: Creating symbolic links in sites-enabled..."
for conf_file in "$NGINX_CONFIG_DIR"/*.conf; do
    if [ -f "$conf_file" ]; then
        filename=$(basename "$conf_file")
        if [ ! -L "$NGINX_SITES_ENABLED/$filename" ]; then
            echo "  - Creating symbolic link for $filename"
            ln -sf "$NGINX_SITES_AVAILABLE/$filename" "$NGINX_SITES_ENABLED/$filename"
        else
            echo "  - Symbolic link already exists for $filename"
        fi
    fi
done
echo ""

# Test nginx configuration
echo "Step 3: Testing nginx configuration..."
if nginx -t; then
    echo "  ✓ nginx configuration is valid"
else
    echo "  ✗ nginx configuration test failed"
    echo "  Please fix the configuration errors before deploying"
    exit 1
fi
echo ""

# Reload nginx
echo "Step 4: Reloading nginx..."
if systemctl reload nginx; then
    echo "  ✓ nginx reloaded successfully"
else
    echo "  ✗ Failed to reload nginx"
    exit 1
fi
echo ""

echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Active nginx configurations:"
ls -l "$NGINX_SITES_ENABLED"/*.conf 2>/dev/null || echo "  No configuration files found"
echo ""
