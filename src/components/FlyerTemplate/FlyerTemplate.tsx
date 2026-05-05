import { forwardRef } from 'react';
import type { FlyerData } from '../../types/FlyerData';

interface Props {
  data: Partial<FlyerData>;
}

const YELLOW = '#f5c500';
const WHITE = '#ffffff';

/** Helper to Title Case strings (e.g. "michael ehigie" -> "Michael Ehigie") */
function toTitleCase(str: string = '') {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** A single right-column value rendered with Raleway font */
function RalewayValue({ top, left = '620px', value, fontSize = '28px', color = WHITE, fontWeight = 600, width = '510px' }: {
  top: number;
  left?: string;
  value?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: number;
  width?: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${top}px`,
        left,
        width,
        color,
        fontFamily: '"Raleway", sans-serif',
        fontSize,
        fontWeight,
        lineHeight: 1.2,
        wordBreak: 'break-word',
      }}
    >
      {value || ''}
    </div>
  );
}

export const FlyerTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const {
    firstName,
    surname,
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
        height: '1400px',
        backgroundImage: 'url("/images/background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    > 
      {/* ── PHOTO ── */}
      {photo && (
        <div
          style={{
            position: 'absolute',
            top: '377px',
            left: '154px',
            width: '328px',
            height: '434px',
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

      {/* ── SURNAME ── */}
      <div
        style={{
          position: 'absolute',
          top: '953px',
          left: '115px',
          width: '450px',
          color: YELLOW,
          fontFamily: '"Raleway", sans-serif',
          fontWeight: 900,
          fontSize: '66px',
          transform: 'rotate(-5deg)',
          lineHeight: 1.0,
          letterSpacing: '-1px',
        }}
      >
        {toTitleCase(surname)}
      </div>

      {/* ── FIRSTNAME ── */}
      <div
        style={{
          position: 'absolute',
          top: '1025px',
          left: '125px',
          width: '450px',
          color: YELLOW,
          fontFamily: '"Raleway", sans-serif',
          fontWeight: 700,
          fontSize: '56px',
          lineHeight: 1.0,
          letterSpacing: '-1px',
        }}
      >
        {toTitleCase(firstName)}
      </div>

      {/* ── BIRTHDAY ── */}
      <RalewayValue
        top={1095}
        left="125px"
        width="450px"
        fontSize="34px"
        fontWeight={400}
        value={dateOfBirth ? `Birthday: ${dateOfBirth.replace('-', ' ')}` : ''}
      />

      {/* ── FAVOURITE QUOTE ── */}
      <div
        style={{
          position: 'absolute',
          top: '1155px',
          left: '114px',
          width: '360px',
          height: '108px',
          color: 'black',
          fontWeight: 600,
          fontFamily: '"Raleway", sans-serif',
          fontSize: '20px',
          fontStyle: 'italic',
          lineHeight: 1.2,
          overflow: 'hidden',
        }}
      >
        {favouriteQuote || ''}
      </div>

      {/* ── SOCIAL HANDLE ── */}
      <div
        style={{
          position: 'absolute',
          top: '1265px',
          left: '156px',
          color: WHITE,
          fontFamily: '"Raleway", sans-serif',
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        {socialHandle || ''}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '1294px',
          left: '126px',
          color: WHITE,
          fontFamily: '"Raleway", sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          letterSpacing: '0.5px',
        }}
      >
        Social media handle
      </div>

      {/* ── RIGHT COLUMN VALUES ── */}
      <RalewayValue top={445}  value={toTitleCase(hobbies)} />
      <RalewayValue top={535}  value={toTitleCase(bestCourse)} />
      <RalewayValue top={625}  value={toTitleCase(bestLecturer)} />
      <RalewayValue top={725}  value={toTitleCase(bestLevel)} />
      <RalewayValue top={815}  value={toTitleCase(worstLevel)} />
      <RalewayValue top={915}  value={toTitleCase(favouriteCourseMate)} />
      <RalewayValue top={1005} value={toTitleCase(ifNotSoftware)} />

      {/* ── BEST EXPERIENCE ── */}
      <div
        style={{
          position: 'absolute',
          top: '1105px',
          left: '620px',
          width: '400px',
          height: '108px',
          color: 'white',
          fontWeight: 600,
          fontFamily: '"Raleway", sans-serif',
          fontSize: '20px',
          fontStyle: 'italic',
          lineHeight: 1.2,
          overflow: 'hidden',
        }}
      >
        {bestExperienceInAuchi || ''}
      </div>

      {/* ── WORST EXPERIENCE ── */}
      <div
        style={{
          position: 'absolute',
          top: '1220px',
          left: '620px',
          width: '400px',
          height: '108px',
          color: 'white',
          fontWeight: 600,
          fontFamily: '"Raleway", sans-serif',
          fontSize: '20px',
          fontStyle: 'italic',
          lineHeight: 1.2,
          overflow: 'hidden',
        }}
      >
        {worstExperienceInAuchi || ''}
      </div>

    </div>
  );
});

FlyerTemplate.displayName = 'FlyerTemplate';