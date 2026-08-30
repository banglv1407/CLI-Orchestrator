use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RectCollider {
    pub x: f32,
    pub y: f32,
    pub w: f32,
    pub h: f32,
}

pub struct StationMap {
    pub width: f32,
    pub height: f32,
    pub walls: Vec<RectCollider>,
}

impl Default for StationMap {
    fn default() -> Self {
        Self {
            width: 2400.0,
            height: 1800.0,
            walls: vec![
                // Outer boundaries
                RectCollider { x: 0.0, y: 0.0, w: 2400.0, h: 40.0 },
                RectCollider { x: 0.0, y: 1760.0, w: 2400.0, h: 40.0 },
                RectCollider { x: 0.0, y: 0.0, w: 40.0, h: 1800.0 },
                RectCollider { x: 2360.0, y: 0.0, w: 40.0, h: 1800.0 },
                // Quantum Core Room
                RectCollider { x: 300.0, y: 300.0, w: 400.0, h: 20.0 },
                RectCollider { x: 300.0, y: 300.0, w: 20.0, h: 400.0 },
                RectCollider { x: 300.0, y: 700.0, w: 400.0, h: 20.0 },
                // Server Farm Room
                RectCollider { x: 1200.0, y: 400.0, w: 500.0, h: 20.0 },
                RectCollider { x: 1200.0, y: 400.0, w: 20.0, h: 500.0 },
            ],
        }
    }
}
