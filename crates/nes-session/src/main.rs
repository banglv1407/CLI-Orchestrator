use nes_session::{build_router, AppState};
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("nes_session=trace,tower_http=debug,axum=debug")),
        )
        .init();

    let bind_addr = std::env::var("NES_SESSION_BIND").unwrap_or_else(|_| "0.0.0.0:8080".into());
    let signal_url =
        std::env::var("NES_SIGNAL_URL").unwrap_or_else(|_| "ws://localhost:8080/v1/signal".into());
    if !(signal_url.starts_with("ws://") || signal_url.starts_with("wss://")) {
        return Err("NES_SIGNAL_URL must start with ws:// or wss://".into());
    }
    tracing::info!("Configured base NES_SIGNAL_URL: {signal_url} (auto-fallback to client Host)");
    let state = AppState::with_signal_url(signal_url);

    let app = build_router(state);
    let listener = tokio::net::TcpListener::bind(&bind_addr).await?;
    tracing::info!("nes-session input-only service listening on {bind_addr}");
    axum::serve(listener, app).await?;
    Ok(())
}
