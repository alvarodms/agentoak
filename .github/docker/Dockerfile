FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# System dependencies for pokeemerald build + agent tooling
RUN apt-get update -qq && apt-get install -y -qq \
    gcc-arm-none-eabi \
    binutils-arm-none-eabi \
    libpng-dev \
    build-essential \
    git \
    curl \
    make \
    rsync \
    unzip \
    ca-certificates \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Build and install agbcc (GBA-specific C compiler) to /opt/agbcc
# The workflow copies this to pokeemerald/tools/agbcc after checkout
RUN git clone --depth 1 https://github.com/pret/agbcc.git /tmp/agbcc \
    && cd /tmp/agbcc \
    && ./build.sh \
    && ./install.sh /opt/agbcc \
    && rm -rf /tmp/agbcc

# Build Flips (IPS patcher) from source — flatpak is not usable in containers
RUN git clone --depth 1 https://github.com/Alcaro/Flips.git /tmp/flips \
    && cd /tmp/flips \
    && make flips \
    && cp flips /usr/local/bin/flips \
    && rm -rf /tmp/flips

# Install RTK (Rust Token Killer) for Claude Code cost tracking
RUN curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh \
    && cp /root/.local/bin/rtk /usr/local/bin/rtk \
    && rm -rf /root/.local/bin/rtk

# Sanity-check all required tools are present and executable
RUN arm-none-eabi-gcc --version \
    && /opt/agbcc/bin/agbcc --version 2>&1 | head -1 \
    && flips --version 2>&1 | head -1 || true \
    && rtk --version 2>&1 | head -1 || true
