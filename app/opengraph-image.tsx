import { ImageResponse } from "next/og";

export const alt =
  "BuildKind Tech — Frame shop websites, SimpleFrame POS, and a merchant fee guarantee";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#faf7f1",
          color: "#111827",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 18,
            backgroundColor: "#d97706",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px 56px 90px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 58,
                height: 58,
                position: "relative",
                marginRight: 20,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 40,
                  height: 40,
                  border: "7px solid #111827",
                  borderRadius: 3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: 14,
                  width: 40,
                  height: 40,
                  border: "7px solid #d97706",
                  borderRadius: 3,
                  backgroundColor: "#faf7f1",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  top: 22,
                  width: 24,
                  height: 24,
                  border: "4px solid #65d6c5",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: -0.8,
              }}
            >
              BuildKind
              <span style={{ color: "#6b7280", marginLeft: 10, letterSpacing: 1.2 }}>TECH</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -1.8,
              }}
            >
              Websites and workflows for frame shops.
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 28,
                color: "#4b5563",
                lineHeight: 1.35,
              }}
            >
              SimpleFrame POS · merchant fee guarantee · modern shop sites
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#6b7280",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            <span>buildkind.tech</span>
            <span style={{ color: "#d97706" }}>Built for custom frame shops</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
