import type { FlyerData } from '../types/FlyerData';

const YELLOW = '#f5c500';
const DARK_GREEN = '#062a0c';
const PANEL_BG = '#0a3b12';
const WHITE = '#ffffff';
const LABEL_BG = '#111';

// Auchi Polytechnic logo SVG as base64 data URL
const LOGO_B64 = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#f5c500" stroke="#062a0c" stroke-width="3"/>
  <circle cx="50" cy="50" r="38" fill="#062a0c"/>
  <text x="50" y="38" text-anchor="middle" fill="#f5c500" font-size="9" font-weight="bold" font-family="Arial">AUCHI</text>
  <text x="50" y="48" text-anchor="middle" fill="#f5c500" font-size="7" font-family="Arial">POLYTECHNIC</text>
  <rect x="30" y="52" width="40" height="26" rx="3" fill="#f5c500"/>
  <line x1="50" y1="54" x2="50" y2="78" stroke="#062a0c" stroke-width="2"/>
  <line x1="30" y1="66" x2="70" y2="66" stroke="#062a0c" stroke-width="2"/>
  <text x="50" y="90" text-anchor="middle" fill="#062a0c" font-size="7" font-weight="bold" font-family="Arial">BRAIN FOR DEV</text>
</svg>`)}`;

interface Props {
  data: Partial<FlyerData>;
}

// Helper: label badge + value row for the right panel
function FieldRow({
  label,
  value,
  minHeight = 62,
}: {
  label: string;
  value: string;
  minHeight?: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8,
        minHeight,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: LABEL_BG,
          color: YELLOW,
          fontWeight: 700,
          fontSize: 13,
          padding: '6px 8px',
          width: 130,
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: WHITE,
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          fontSize: 15,
          color: '#111',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.3,
        }}
      >
        {value || ''}
      </div>
    </div>
  );
}

// Helper: left-panel info row (label above value box)
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 8 }}>
      <div
        style={{
          backgroundColor: YELLOW,
          color: DARK_GREEN,
          fontSize: 13,
          fontWeight: 800,
          padding: '2px 10px',
          borderRadius: 4,
          alignSelf: 'flex-start',
          marginBottom: 4,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          backgroundColor: WHITE,
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 15,
          color: '#111',
          width: '100%',
          whiteSpace: 'pre-wrap',
        }}
      >
        {value || ''}
      </div>
    </div>
  );
}

export function FlyerTemplate({ data }: Props) {
  const handle = (data.socialHandle || '').replace(/^@/, '');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 1080,
        height: 1350,
        backgroundColor: DARK_GREEN,
        padding: 24,
        fontFamily: 'Inter',
        position: 'relative',
      }}
    >
      {/* ── TOP HEADER ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 16, alignItems: 'stretch' }}>
        {/* School info card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: WHITE,
            borderRadius: 12,
            padding: '10px 16px',
            flex: 1,
            marginRight: 20,
          }}
        >
          <img src={LOGO_B64} width={68} height={68} style={{ marginRight: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: DARK_GREEN,
                letterSpacing: 1,
                fontFamily: 'Oswald',
              }}
            >
              AUCHI POLYTECHNIC
            </div>
            <div style={{ width: '100%', height: 2, backgroundColor: YELLOW, margin: '3px 0' }} />
            <div style={{ fontSize: 13, color: '#333' }}>Auchi, Edo State</div>
            <div style={{ fontSize: 12, color: '#555' }}>
              Computer Science (Software &amp; Web Development)
            </div>
          </div>
        </div>

        {/* FYB OF THE WEEK title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: WHITE,
              fontFamily: 'Oswald',
              lineHeight: 0.9,
              letterSpacing: -2,
            }}
          >
            FYB
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: DARK_GREEN,
              backgroundColor: YELLOW,
              padding: '2px 14px',
              letterSpacing: 2,
            }}
          >
            OF THE
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: WHITE,
              fontFamily: 'Oswald',
              lineHeight: 0.9,
              letterSpacing: -2,
            }}
          >
            WEEK
          </div>
        </div>
      </div>

      {/* ── CONTENT ROW ───────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: 16 }}>
        {/* ── LEFT PANEL ─────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 390,
            border: `3px solid ${YELLOW}`,
            borderRadius: 16,
            padding: 14,
            alignItems: 'center',
            backgroundColor: PANEL_BG,
          }}
        >
          {/* Photo */}
          {data.photo ? (
            <img
              src={data.photo}
              width={340}
              height={436}
              style={{ borderRadius: 8, border: `4px solid ${YELLOW}` }}
            />
          ) : (
            <div
              style={{
                width: 340,
                height: 436,
                borderRadius: 8,
                border: `4px solid ${YELLOW}`,
                backgroundColor: '#1a4a20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: YELLOW, fontSize: 18, opacity: 0.5 }}>Photo</div>
            </div>
          )}

          {/* Divider */}
          <div style={{ width: '100%', height: 2, backgroundColor: YELLOW, margin: '10px 0' }} />

          <InfoRow label="NAME" value={data.fullName || ''} />
          <InfoRow label="D.O.B" value={data.dateOfBirth || ''} />
          <InfoRow label="STATE OF ORIGIN" value={data.stateOfOrigin || ''} />
          <InfoRow label="FAVOURITE QUOTE" value={data.favouriteQuote ? `"${data.favouriteQuote.replace(/^["']|["']$/g, '')}"` : ''} />

          {/* Social handle */}
          <div style={{ marginTop: 6, color: WHITE, fontSize: 14, letterSpacing: 1 }}>
            SOCIAL MEDIA HANDLE
          </div>
          <div style={{ color: WHITE, fontSize: 15, fontWeight: 600 }}>
            @{handle || '_______________'}
          </div>
          {/* Footer */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 8,
              color: WHITE,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            #FYB PROFILE
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            border: `3px solid ${YELLOW}`,
            borderRadius: 16,
            padding: 14,
            backgroundColor: PANEL_BG,
          }}
        >
          <FieldRow label="HOBBIES" value={data.hobbies || ''} />
          <FieldRow label="BEST COURSE" value={data.bestCourse || ''} />
          <FieldRow label="BEST LECTURER" value={data.bestLecturer || ''} />
          <FieldRow label="BEST LEVEL" value={data.bestLevel || ''} />
          <FieldRow label="WORST LEVEL" value={data.worstLevel || ''} />
          <FieldRow label={'FAVOURITE\nCOURSE MATE'} value={data.favouriteCourseMate || ''} />
          <FieldRow label={'IF NOT\nSOFTWARE'} value={data.ifNotSoftware || ''} />
          <FieldRow
            label={'BEST EXPERIENCE\nIN AUCHI'}
            value={data.bestExperienceInAuchi || ''}
            minHeight={90}
          />
          <FieldRow
            label={'WORST EXPERIENCE\nIN AUCHI'}
            value={data.worstExperienceInAuchi || ''}
            minHeight={90}
          />
        </div>
      </div>
    </div>
  );
}
