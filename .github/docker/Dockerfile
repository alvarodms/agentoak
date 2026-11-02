FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# System dependencies for pokeemerald build + agent tooling
RUN apt-get update -qq && apt-get install -y -qq \
    gcc-arm-none-eabi \
    binutils-arm-none-eabi \
    libpng-dev \
    zlib1g-dev \
    cmake \
    pkg-config \
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
# install.sh expects a pokeemerald root and creates <dir>/tools/agbcc/ inside it,
# so we use a staging dir then move the nested result to /opt/agbcc.
# The workflow copies /opt/agbcc to pokeemerald/tools/agbcc after checkout.
ARG AGBCC_COMMIT=da598c1d918402c42c0c0d7128ba14567f3175e9
RUN git clone https://github.com/pret/agbcc.git /tmp/agbcc \
    && cd /tmp/agbcc \
    && git checkout $AGBCC_COMMIT \
    && ./build.sh \
    && mkdir -p /tmp/agbcc-staging \
    && ./install.sh /tmp/agbcc-staging \
    && mv /tmp/agbcc-staging/tools/agbcc /opt/agbcc \
    && rm -rf /tmp/agbcc /tmp/agbcc-staging

# Build Flips (IPS patcher) from source — flatpak is not usable in containers
ARG FLIPS_COMMIT=ff216a75df0987047a67d7923567dc4482ce07ac
RUN git clone https://github.com/Alcaro/Flips.git /tmp/flips \
    && cd /tmp/flips \
    && git checkout $FLIPS_COMMIT \
    && TARGET=cli make flips \
    && cp flips /usr/local/bin/flips \
    && rm -rf /tmp/flips

# Build a minimal static libmgba (GBA core only; no frontends, GL, audio
# codecs or scripting runtimes) for the headless playtest driver.
ARG MGBA_VERSION=0.10.5
RUN git clone --depth 1 --branch $MGBA_VERSION https://github.com/mgba-emu/mgba.git /tmp/mgba \
    && cmake -S /tmp/mgba -B /tmp/mgba/out \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_INSTALL_PREFIX=/opt/mgba \
        -DCMAKE_INSTALL_LIBDIR=lib \
        -DBUILD_STATIC=ON -DBUILD_SHARED=OFF \
        -DBUILD_QT=OFF -DBUILD_SDL=OFF -DBUILD_LTO=OFF \
        -DBUILD_GL=OFF -DBUILD_GLES2=OFF -DBUILD_GLES3=OFF -DUSE_EPOXY=OFF \
        -DM_CORE_GB=OFF -DENABLE_SCRIPTING=OFF -DUSE_LUA=OFF \
        -DUSE_FFMPEG=OFF -DUSE_SQLITE3=OFF -DUSE_ELF=OFF -DUSE_LIBZIP=OFF \
        -DUSE_MINIZIP=OFF -DUSE_LZMA=OFF -DUSE_DISCORD_RPC=OFF \
        -DUSE_DEBUGGERS=OFF -DUSE_EDITLINE=OFF -DUSE_GDB_STUB=OFF \
    && cmake --build /tmp/mgba/out -j"$(nproc)" \
    && cmake --install /tmp/mgba/out \
    && rm -rf /tmp/mgba

# mgba-driver: line-protocol front end the runner's playtest harness spawns.
# `-include mgba/flags.h` makes the driver see the same feature macros the
# library was built with; struct mCore's layout depends on them.
COPY mgba-driver /tmp/mgba-driver
RUN gcc -O2 -Wall -Wextra -include mgba/flags.h -I/opt/mgba/include \
        -o /usr/local/bin/mgba-driver /tmp/mgba-driver/mgba-driver.c \
        -L/opt/mgba/lib -lmgba -lpng -lz -lm -lpthread \
    && rm -rf /tmp/mgba-driver

# Sanity-check all required tools are present and executable
RUN arm-none-eabi-gcc --version \
    && /opt/agbcc/bin/agbcc --version 2>&1 | head -1 \
    && echo info | mgba-driver | grep -q '"ready"' \
    && (flips --version 2>&1 | head -1 || true)
