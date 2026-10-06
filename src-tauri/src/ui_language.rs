use std::path::Path;

#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum UiLanguage {
    #[default]
    En,
    Vi,
    Ko,
}

pub struct NativeCopy {
    pub show: &'static str,
    pub hide: &'static str,
    pub quit: &'static str,
    pub exit_title: &'static str,
    pub exit_message: &'static str,
    pub hide_button: &'static str,
    pub quit_button: &'static str,
}

impl UiLanguage {
    pub fn parse(value: &str) -> Option<Self> {
        match value.trim() {
            "en" => Some(Self::En),
            "vi" => Some(Self::Vi),
            "ko" => Some(Self::Ko),
            _ => None,
        }
    }

    pub fn code(self) -> &'static str {
        match self {
            Self::En => "en",
            Self::Vi => "vi",
            Self::Ko => "ko",
        }
    }

    pub fn load(path: &Path) -> Self {
        std::fs::read_to_string(path)
            .ok()
            .and_then(|value| Self::parse(&value))
            .unwrap_or_default()
    }

    pub fn copy(self) -> NativeCopy {
        match self {
            Self::En => NativeCopy {
                show: "Show application",
                hide: "Hide to system tray",
                quit: "Exit application",
                exit_title: "Exit application",
                exit_message: "Hide CLX to the system tray and keep it running, or exit the application completely?",
                hide_button: "Hide to tray",
                quit_button: "Exit",
            },
            Self::Vi => NativeCopy {
                show: "Hiện ứng dụng",
                hide: "Ẩn xuống khay hệ thống",
                quit: "Thoát ứng dụng",
                exit_title: "Thoát ứng dụng",
                exit_message: "Ẩn CLX xuống khay hệ thống để tiếp tục chạy, hay thoát hoàn toàn ứng dụng?",
                hide_button: "Ẩn xuống khay",
                quit_button: "Thoát",
            },
            Self::Ko => NativeCopy {
                show: "앱 표시",
                hide: "시스템 트레이로 숨기기",
                quit: "앱 종료",
                exit_title: "앱 종료",
                exit_message: "CLX를 시스템 트레이로 숨겨 계속 실행할까요, 아니면 앱을 완전히 종료할까요?",
                hide_button: "트레이로 숨기기",
                quit_button: "종료",
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_only_supported_preferences() {
        for language in [UiLanguage::En, UiLanguage::Vi, UiLanguage::Ko] {
            assert_eq!(UiLanguage::parse(language.code()), Some(language));
        }
        assert_eq!(UiLanguage::parse(" \nvi\n"), Some(UiLanguage::Vi));
        for value in ["", "fr", "EN", "../../ko", "ko-KR"] {
            assert_eq!(UiLanguage::parse(value), None);
        }
    }

    #[test]
    fn every_native_surface_has_localized_copy() {
        let en = UiLanguage::En.copy();
        for language in [UiLanguage::Vi, UiLanguage::Ko] {
            let copy = language.copy();
            for (localized, english) in [
                (copy.show, en.show),
                (copy.hide, en.hide),
                (copy.quit, en.quit),
                (copy.exit_title, en.exit_title),
                (copy.exit_message, en.exit_message),
                (copy.hide_button, en.hide_button),
                (copy.quit_button, en.quit_button),
            ] {
                assert!(!localized.is_empty());
                assert_ne!(localized, english);
            }
        }
    }

    #[test]
    fn missing_native_preference_defaults_to_english() {
        assert_eq!(
            UiLanguage::load(Path::new("__clx_missing_locale_fixture__")),
            UiLanguage::En
        );
    }
}
