import { forwardRef } from 'react';
import type { FlyerData } from '../../types/FlyerData';

interface ExtendedFlyerData extends Partial<FlyerData> {
  favouriteCourseMate?: string;
  ifNotSoftware?: string;
  bestExperienceInAuchi?: string;
  worstExperienceInAuchi?: string;
}

interface Props {
  data: ExtendedFlyerData;
}

const YELLOW = '#f5c500';
const WHITE = '#ffffff';

/** A single right-column value rendered below its (pre-baked) label */
function RightValue({ top, value }: { top: number; value?: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: '620px',
        width: '510px',
        color: WHITE,
        fontFamily: '"Inter", "Helvetica Neue", sans-serif',
        fontSize: '22px',
        fontWeight: 400,
        lineHeight: 1.3,
        wordBreak: 'break-word',
      }}
    >
      {value || ''}
    </div>
  );
}

export const FlyerTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const {
    fullName,
    dateOfBirth,
    favouriteQuote,
    socialHandle,
    hobbies,
    bestCourse,
    bestLecturer,
    bestLevel,
    worstLevel,
    photo,
    favouriteCourseMate,
    ifNotSoftware,
    bestExperienceInAuchi,
    worstExperienceInAuchi,
  } = data;

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1350px',
        backgroundImage: 'url("/images/background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: '"Inter", "Helvetica Neue", sans-serif',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >

      {/* ── PHOTO ── sits inside the tilted frame baked into the background */}
      {photo && (
        <div
          style={{
            position: 'absolute',
            top: '352px',
            left: '154px',
            width: '328px',
            // height: '434px',
            overflow: 'hidden',
            transform: 'rotate(5.5deg)',
            transformOrigin: 'center center',
            borderRadius: '4px',
          }}
        >
          <img
            src={photo}
            alt="Student"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      )}

      {/* ── FULL NAME ── large yellow text below the photo */}
      <div
        style={{
          position: 'absolute',
          top: '718px',
          left: '55px',
          width: '450px',
          color: YELLOW,
          fontFamily: '"Oswald", "Arial Black", sans-serif',
          fontWeight: 700,
          fontSize: '56px',
          lineHeight: 1.0,
          letterSpacing: '-1px',
        }}
      >
        {fullName}
      </div>

      {/* ── BIRTHDAY ── */}
      <div
        style={{
          position: 'absolute',
          top: '870px',
          left: '55px',
          width: '450px',
          color: WHITE,
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          fontSize: '24px',
          fontWeight: 600,
        }}
      >
        {dateOfBirth ? `Birthday: ${dateOfBirth}` : ''}
      </div>

      {/* ── FAVOURITE QUOTE ── overlaid on the white quote box in the bg */}
      <div
        style={{
          position: 'absolute',
          top: '985px',
          left: '72px',
          width: '360px',
          height: '108px',
          color: '#555',
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          fontSize: '15px',
          fontStyle: 'italic',
          lineHeight: 1.45,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {favouriteQuote || ''}
      </div>

      {/* ── SOCIAL HANDLE ── @ symbol is already on the bg */}
      <div
        style={{
          position: 'absolute',
          top: '1152px',
          left: '96px',
          color: WHITE,
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        {socialHandle || ''}
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT COLUMN VALUES
          Each sits directly below its yellow label
          already printed on the background image.
          Tweak the `top` values by ±5–10px if your
          background image renders at a slightly
          different crop / scale.
      ══════════════════════════════════════════════ */}
      <RightValue top={420}  value={hobbies} />
      <RightValue top={468}  value={bestCourse} />
      <RightValue top={546}  value={bestLecturer} />
      <RightValue top={624}  value={bestLevel} />
      <RightValue top={700}  value={worstLevel} />
      <RightValue top={778}  value={favouriteCourseMate} />
      <RightValue top={856}  value={ifNotSoftware} />
      <RightValue top={934}  value={bestExperienceInAuchi} />
      <RightValue top={1012} value={worstExperienceInAuchi} />

    </div>
  );
});

FlyerTemplate.displayName = 'FlyerTemplate';