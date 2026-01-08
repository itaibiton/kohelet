import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * OG Image API Route
 * Generates dynamic Open Graph images for social media sharing
 *
 * Query Parameters:
 * - title: The title text to display (default: "Kohelet Digital")
 * - type: Content type (default: "website")
 * - locale: Language locale for RTL support (default: "en")
 *
 * @example
 * /api/og?title=Building%20Modern%20Websites
 * /api/og?title=בניית%20אתרים&locale=he
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters with defaults
    const title = searchParams.get('title') || 'Kohelet Digital';
    const type = searchParams.get('type') || 'website';
    const locale = searchParams.get('locale') || 'en';

    // Determine text direction based on locale
    const isRTL = locale === 'he';
    const direction = isRTL ? 'rtl' : 'ltr';

    // Generate subtitle based on content type
    const subtitle = type === 'blog'
      ? (isRTL ? 'מאמר בבלוג' : 'Blog Post')
      : (isRTL ? 'פתרונות דיגיטליים מתקדמים' : 'Advanced Digital Solutions');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#020204',
            position: 'relative',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Gradient Background Accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            }}
          />

          {/* Blue Accent Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 120px',
              maxWidth: '1000px',
              textAlign: 'center',
              direction: direction,
            }}
          >
            {/* Brand Name */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '40px',
                letterSpacing: '-0.02em',
              }}
            >
              KOHELET DIGITAL
            </div>

            {/* Main Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '32px',
                wordWrap: 'break-word',
                maxWidth: '100%',
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '32px',
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '-0.01em',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
            }}
          />

          {/* Geometric Accent Elements */}
          <div
            style={{
              position: 'absolute',
              top: '120px',
              right: '120px',
              width: '120px',
              height: '120px',
              border: '3px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '24px',
              transform: 'rotate(15deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '120px',
              left: '120px',
              width: '80px',
              height: '80px',
              border: '3px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              transform: 'rotate(-15deg)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);

    // Return fallback image on error
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#020204',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: '800',
              color: '#3b82f6',
            }}
          >
            KOHELET DIGITAL
          </div>
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: '24px',
            }}
          >
            Advanced Digital Solutions
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
