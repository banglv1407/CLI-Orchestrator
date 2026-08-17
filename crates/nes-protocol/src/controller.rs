//! Controller bitmask — the canonical eight-bit state for one NES controller.
//!
//! Bit order (MSB..LSB is Start, Select, B, A, Right, Left, Down, Up) matches
//! the wire format in the plan; the constant values here are what cross the
//! authenticated input-only room WebSocket.

pub const BIT_UP: u8 = 0x01;
pub const BIT_DOWN: u8 = 0x02;
pub const BIT_LEFT: u8 = 0x04;
pub const BIT_RIGHT: u8 = 0x08;
pub const BIT_A: u8 = 0x10;
pub const BIT_B: u8 = 0x20;
pub const BIT_SELECT: u8 = 0x40;
pub const BIT_START: u8 = 0x80;

/// Only these eight bits are meaningful.
pub const CONTROLLER_MASK_VALID: u8 =
    BIT_UP | BIT_DOWN | BIT_LEFT | BIT_RIGHT | BIT_A | BIT_B | BIT_SELECT | BIT_START;

/// Up+Down and Left+Right are physically impossible on a d-pad.
pub const CONTROLLER_MASK_OPPOSING: u8 = (BIT_UP | BIT_DOWN) | (BIT_LEFT | BIT_RIGHT);

/// Validate a controller bitmask before it reaches JSNES. Rejects bits outside
/// the eight-button set and impossible opposing directions.
pub fn validate_bitmask(mask: u8) -> Result<u8, crate::NesProtocolError> {
    if mask & !CONTROLLER_MASK_VALID != 0 {
        return Err(crate::NesProtocolError::InvalidBitmask(mask));
    }
    if (mask & (BIT_UP | BIT_DOWN)) == (BIT_UP | BIT_DOWN)
        || (mask & (BIT_LEFT | BIT_RIGHT)) == (BIT_LEFT | BIT_RIGHT)
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
            validate_bitmask(BIT_A | BIT_START).unwrap(),
            BIT_A | BIT_START
        );
        assert_eq!(
            validate_bitmask(BIT_UP | BIT_LEFT | BIT_A | BIT_B | BIT_SELECT | BIT_START).unwrap(),
            BIT_UP | BIT_LEFT | BIT_A | BIT_B | BIT_SELECT | BIT_START
        );
    }

    #[test]
    fn u8_covers_exactly_the_eight_controller_bits() {
        assert_eq!(CONTROLLER_MASK_VALID.count_ones(), 8);
        assert_eq!(CONTROLLER_MASK_VALID, u8::MAX);
    }

    #[test]
    fn rejects_opposing_directions() {
        assert!(validate_bitmask(BIT_UP | BIT_DOWN).is_err());
        assert!(validate_bitmask(BIT_LEFT | BIT_RIGHT).is_err());
        // Up+Left is fine (diagonal)
        assert!(validate_bitmask(BIT_UP | BIT_LEFT).is_ok());
    }
}
