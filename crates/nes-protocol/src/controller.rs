//! Controller bitmask — the canonical twelve-bit state for one gamepad.
//!
//! Bits 0..7 are the original NES buttons (Up, Down, Left, Right, A, B,
//! Select, Start) and keep their historical values. Bits 8..11 are the four
//! SNES-only extensions (X, Y, L, R) so a single u16 wire format serves both
//! consoles: JSNES consumes the low byte, EmulatorJS maps all twelve.

pub const BIT_UP: u8 = 0x01;
pub const BIT_DOWN: u8 = 0x02;
pub const BIT_LEFT: u8 = 0x04;
pub const BIT_RIGHT: u8 = 0x08;
pub const BIT_A: u8 = 0x10;
pub const BIT_B: u8 = 0x20;
pub const BIT_SELECT: u8 = 0x40;
pub const BIT_START: u8 = 0x80;

/// SNES-only extensions carried in bits 8..11 of the shared mask.
pub const BIT_X: u16 = 0x100;
pub const BIT_Y: u16 = 0x200;
pub const BIT_L: u16 = 0x400;
pub const BIT_R: u16 = 0x800;

/// Only these twelve bits are meaningful across both consoles.
pub const CONTROLLER_MASK_VALID: u16 =
    (BIT_UP | BIT_DOWN | BIT_LEFT | BIT_RIGHT | BIT_A | BIT_B | BIT_SELECT | BIT_START) as u16
        | BIT_X
        | BIT_Y
        | BIT_L
        | BIT_R;

/// Up+Down and Left+Right are physically impossible on a d-pad.
pub const CONTROLLER_MASK_OPPOSING: u16 = ((BIT_UP | BIT_DOWN) | (BIT_LEFT | BIT_RIGHT)) as u16;

/// Validate a controller bitmask before it reaches an emulator core. Rejects
/// bits outside the twelve-button set and impossible opposing directions.
pub fn validate_bitmask(mask: u16) -> Result<u16, crate::NesProtocolError> {
    if mask & !CONTROLLER_MASK_VALID != 0 {
        return Err(crate::NesProtocolError::InvalidBitmask(mask));
    }
    if (mask & (BIT_UP as u16 | BIT_DOWN as u16)) == (BIT_UP as u16 | BIT_DOWN as u16)
        || (mask & (BIT_LEFT as u16 | BIT_RIGHT as u16)) == (BIT_LEFT as u16 | BIT_RIGHT as u16)
    {
        return Err(crate::NesProtocolError::OpposingDirections(mask));
    }
    Ok(mask)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_clean_and_mixed() {
        assert_eq!(validate_bitmask(0).unwrap(), 0);
        assert_eq!(
            validate_bitmask(BIT_A as u16 | BIT_START as u16).unwrap(),
            BIT_A as u16 | BIT_START as u16
        );
        assert_eq!(
            validate_bitmask(
                BIT_UP as u16
                    | BIT_LEFT as u16
                    | BIT_A as u16
                    | BIT_B as u16
                    | BIT_SELECT as u16
                    | BIT_START as u16
            )
            .unwrap(),
            BIT_UP as u16
                | BIT_LEFT as u16
                | BIT_A as u16
                | BIT_B as u16
                | BIT_SELECT as u16
                | BIT_START as u16
        );
    }

    #[test]
    fn snes_extension_bits_pass_through() {
        let full = BIT_X | BIT_Y | BIT_L | BIT_R | BIT_B as u16 | BIT_A as u16;
        assert_eq!(validate_bitmask(full).unwrap(), full);
    }

    #[test]
    fn low_byte_covers_exactly_the_eight_nes_bits() {
        assert_eq!(CONTROLLER_MASK_VALID & 0xff, u8::MAX as u16);
        assert_eq!(CONTROLLER_MASK_VALID.count_ones(), 12);
    }

    #[test]
    fn rejects_unknown_and_opposing() {
        assert!(validate_bitmask(0x1000).is_err()); // bit 12 does not exist
        assert!(validate_bitmask(BIT_UP as u16 | BIT_DOWN as u16).is_err());
        assert!(validate_bitmask(BIT_LEFT as u16 | BIT_RIGHT as u16).is_err());
        // Up+Left is fine (diagonal)
        assert!(validate_bitmask(BIT_UP as u16 | BIT_LEFT as u16).is_ok());
    }
}
