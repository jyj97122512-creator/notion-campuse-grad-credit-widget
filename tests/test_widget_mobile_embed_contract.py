from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WIDGET_ROUTE = (ROOT / "src/app/widget/route.ts").read_text(encoding="utf-8")
WIDGET_HTML = (ROOT / "src/lib/widget-html.ts").read_text(encoding="utf-8")


def test_widget_error_responses_keep_success_status_for_mobile_iframes():
    assert "status: isDecryptError ? 400 : 500" not in WIDGET_ROUTE
    assert "errorHtmlDocument(isDecryptError" in WIDGET_ROUTE


def test_widget_document_uses_stable_mobile_iframe_layout():
    assert "width:min(290px,calc(100vw - 32px))" in WIDGET_HTML
    assert "max-width:290px" in WIDGET_HTML
    assert "overflow-x:hidden" in WIDGET_HTML
    assert "display:flex" in WIDGET_HTML
    assert "display:inline-block" not in WIDGET_HTML


if __name__ == "__main__":
    test_widget_error_responses_keep_success_status_for_mobile_iframes()
    test_widget_document_uses_stable_mobile_iframe_layout()
    print("All tests passed.")
