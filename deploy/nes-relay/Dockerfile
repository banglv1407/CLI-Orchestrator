FROM rust:1.94-bookworm AS builder

WORKDIR /build
COPY crates/nes-protocol crates/nes-protocol
COPY crates/nes-session crates/nes-session
RUN cargo build --locked --release --manifest-path crates/nes-session/Cargo.toml

FROM debian:bookworm-slim AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --uid 10001 --create-home --home-dir /var/lib/nes-session nes-session

COPY --from=builder /build/crates/nes-session/target/release/nes-session /usr/local/bin/nes-session

USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/nes-session"]
