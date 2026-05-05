import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PhotoUpload } from './components/PhotoUpload/PhotoUpload';
import { Preview } from './components/Preview/Preview';
import { useDebounce } from './hooks/useDebounce';
import { generateAndDownload } from './lib/generateFlyer';
import { FlyerTemplate } from './components/FlyerTemplate/FlyerTemplate';
import { LEVEL_OPTIONS, NIGERIA_STATES, type FlyerData } from './types/FlyerData';

const MAX_CHARS: Record<string, number> = {
  fullName: 40, stateOfOrigin: 50, favouriteQuote: 120, socialHandle: 40,
  hobbies: 80, bestCourse: 50, bestLecturer: 50, favouriteCourseMate: 50,
  ifNotSoftware: 80, bestExperienceInAuchi: 100, worstExperienceInAuchi: 100,
};

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  const near = len >= max - 10;
  return (
    <span className={`char-counter${near ? ' char-counter--warn' : ''}`}>
      {len}/{max}
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="field-error" role="alert">{message}</p>;
}

export default function App() {
  const [photo, setPhoto] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(window.innerWidth >= 900);
  
  const captureRef = useRef<HTMLDivElement>(null);
  const {
    register, handleSubmit, watch, reset, control,
    formState: { errors },
  } = useForm<FlyerData>({ mode: 'onBlur' });

  const watchedValues = watch();
  const debouncedValues = useDebounce({ ...watchedValues, photo }, 800);

  // Scroll to first error on failed submit
  useEffect(() => {
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const el = document.getElementById(`field-${firstKey}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errors]);

  const onSubmit = useCallback(
    async (data: FlyerData) => {
      if (!photo) {
        const el = document.getElementById('field-photo');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      setIsGenerating(true);
      try {
        await generateAndDownload({ ...data, photo }, captureRef);
        setDownloadDone(true);
      } catch (err) {
        console.error(err);
        alert('Generation failed. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    },
    [photo]
  );

  const handleReset = useCallback(() => {
    reset();
    setPhoto('');
    setDownloadDone(false);
  }, [reset]);

  // Strip @ from social handle on change
  const socialHandleProps = register('socialHandle', {
    maxLength: { value: 40, message: 'Max 40 characters' },
    onChange: (e) => {
      e.target.value = e.target.value.replace(/^@+/, '');
    },
  });

  const isDesktop = window.innerWidth >= 900;

  return (
    <div className="app">
      {/* ── HEADER ─────────────────────────────── */}
      <header className="app-header">
        <div className="app-header__logo">
          <span className="app-header__badge">FYB</span>
          <div>
            <h1 className="app-header__title">FYB of the Week</h1>
            <p className="app-header__sub">Auchi Polytechnic · CS Dept.</p>
          </div>
        </div>
      </header>

      {/* ── LAYOUT ─────────────────────────────── */}
      <div className="layout">
        {/* ── FORM ─────────────────────────────── */}
        <main className="form-area">
          <form id="fyb-form" noValidate onSubmit={handleSubmit(onSubmit)}>

            {/* PHOTO */}
            <section className="form-section" id="field-photo">
              <h2 className="form-section__title">📸 Your Photo</h2>
              <PhotoUpload onCropComplete={setPhoto} />
              {!photo && isGenerating && (
                <p className="field-error">Photo is required.</p>
              )}
            </section>

            {/* PERSONAL INFO */}
            <section className="form-section">
              <h2 className="form-section__title">👤 Personal Info</h2>

              <div className="field" id="field-fullName">
                <label className="field__label" htmlFor="fullName">
                  Full Name <span className="field__required">*</span>
                </label>
                <div className="field__input-row">
                  <input
                    id="fullName"
                    className={`input${errors.fullName ? ' input--error' : ''}`}
                    placeholder="e.g. Michael Ehigie"
                    {...register('fullName', {
                      required: 'Full name is required',
                      maxLength: { value: 40, message: 'Max 40 characters' },
                    })}
                  />
                  <CharCounter value={watchedValues.fullName} max={MAX_CHARS.fullName} />
                </div>
                <FieldError message={errors.fullName?.message} />
              </div>

              <div className="field" id="field-dateOfBirth">
                <label className="field__label" htmlFor="dateOfBirth">
                  Date of Birth <span className="field__required">*</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className={`input${errors.dateOfBirth ? ' input--error' : ''}`}
                  {...register('dateOfBirth', {
                    required: 'Date of birth is required',
                    validate: (v) => new Date(v) < new Date() || 'Must be a past date',
                  })}
                />
                <FieldError message={errors.dateOfBirth?.message} />
              </div>

              <div className="field" id="field-stateOfOrigin">
                <label className="field__label" htmlFor="stateOfOrigin">
                  State of Origin <span className="field__required">*</span>
                </label>
                <div className="field__input-row">
                  <Controller
                    name="stateOfOrigin"
                    control={control}
                    rules={{ required: 'State of origin is required' }}
                    render={({ field }) => (
                      <select
                        id="stateOfOrigin"
                        className={`input select${errors.stateOfOrigin ? ' input--error' : ''}`}
                        {...field}
                      >
                        <option value="">— Select State —</option>
                        {NIGERIA_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <FieldError message={errors.stateOfOrigin?.message} />
              </div>

              <div className="field" id="field-favouriteQuote">
                <label className="field__label" htmlFor="favouriteQuote">
                  Favourite Quote <span className="field__required">*</span>
                </label>
                <div className="field__input-row">
                  <textarea
                    id="favouriteQuote"
                    rows={3}
                    className={`input textarea${errors.favouriteQuote ? ' input--error' : ''}`}
                    placeholder="Your favourite quote (no need to add quotes)"
                    {...register('favouriteQuote', {
                      required: 'Favourite quote is required',
                      maxLength: { value: 120, message: 'Max 120 characters' },
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/^["']+|["']+$/g, '');
                      },
                    })}
                  />
                  <CharCounter value={watchedValues.favouriteQuote} max={MAX_CHARS.favouriteQuote} />
                </div>
                <FieldError message={errors.favouriteQuote?.message} />
              </div>

              <div className="field" id="field-socialHandle">
                <label className="field__label" htmlFor="socialHandle">
                  Social Media Handle
                  <span className="field__optional"> (optional)</span>
                </label>
                <div className="field__input-row">
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">@</span>
                    <input
                      id="socialHandle"
                      className={`input input--prefixed${errors.socialHandle ? ' input--error' : ''}`}
                      placeholder="yourhandle"
                      {...socialHandleProps}
                    />
                  </div>
                  <CharCounter value={watchedValues.socialHandle} max={MAX_CHARS.socialHandle} />
                </div>
                <FieldError message={errors.socialHandle?.message} />
              </div>
            </section>

            {/* ACADEMIC DETAILS */}
            <section className="form-section">
              <h2 className="form-section__title">🎓 Academic Details</h2>

              {[
                { id: 'hobbies', label: 'Hobbies', max: 80, placeholder: 'e.g. Coding, Music, Gaming' },
                { id: 'bestCourse', label: 'Best Course', max: 50, placeholder: 'e.g. Data Structures' },
                { id: 'bestLecturer', label: 'Best Lecturer', max: 50, placeholder: 'e.g. Mr. Adekunle' },
                { id: 'favouriteCourseMate', label: 'Favourite Course Mate', max: 50, placeholder: 'e.g. Chioma Obi' },
                { id: 'ifNotSoftware', label: 'If Not Software, What?', max: 80, placeholder: 'e.g. Architect, Chef...' },
              ].map(({ id, label, max, placeholder }) => (
                <div className="field" id={`field-${id}`} key={id}>
                  <label className="field__label" htmlFor={id}>
                    {label} <span className="field__required">*</span>
                  </label>
                  <div className="field__input-row">
                    <input
                      id={id}
                      className={`input${errors[id as keyof FlyerData] ? ' input--error' : ''}`}
                      placeholder={placeholder}
                      {...register(id as keyof FlyerData, {
                        required: `${label} is required`,
                        maxLength: { value: max, message: `Max ${max} characters` },
                      })}
                    />
                    <CharCounter value={watchedValues[id as keyof FlyerData] as string} max={max} />
                  </div>
                  <FieldError message={errors[id as keyof FlyerData]?.message as string} />
                </div>
              ))}

              <div className="field-row">
                <div className="field" id="field-bestLevel">
                  <label className="field__label" htmlFor="bestLevel">
                    Best Level <span className="field__required">*</span>
                  </label>
                  <Controller
                    name="bestLevel"
                    control={control}
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <select
                        id="bestLevel"
                        className={`input select${errors.bestLevel ? ' input--error' : ''}`}
                        {...field}
                      >
                        <option value="">— Select —</option>
                        {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    )}
                  />
                  <FieldError message={errors.bestLevel?.message} />
                </div>

                <div className="field" id="field-worstLevel">
                  <label className="field__label" htmlFor="worstLevel">
                    Worst Level <span className="field__required">*</span>
                  </label>
                  <Controller
                    name="worstLevel"
                    control={control}
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <select
                        id="worstLevel"
                        className={`input select${errors.worstLevel ? ' input--error' : ''}`}
                        {...field}
                      >
                        <option value="">— Select —</option>
                        {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    )}
                  />
                  <FieldError message={errors.worstLevel?.message} />
                </div>
              </div>
            </section>

            {/* EXPERIENCES */}
            <section className="form-section">
              <h2 className="form-section__title">✨ Auchi Experiences</h2>

              {[
                { id: 'bestExperienceInAuchi', label: 'Best Experience in Auchi', max: 100 },
                { id: 'worstExperienceInAuchi', label: 'Worst Experience in Auchi', max: 100 },
              ].map(({ id, label, max }) => (
                <div className="field" id={`field-${id}`} key={id}>
                  <label className="field__label" htmlFor={id}>
                    {label} <span className="field__required">*</span>
                  </label>
                  <div className="field__input-row">
                    <textarea
                      id={id}
                      rows={3}
                      className={`input textarea${errors[id as keyof FlyerData] ? ' input--error' : ''}`}
                      placeholder={`Describe your ${label.toLowerCase()}…`}
                      {...register(id as keyof FlyerData, {
                        required: `${label} is required`,
                        maxLength: { value: max, message: `Max ${max} characters` },
                      })}
                    />
                    <CharCounter value={watchedValues[id as keyof FlyerData] as string} max={max} />
                  </div>
                  <FieldError message={errors[id as keyof FlyerData]?.message as string} />
                </div>
              ))}
            </section>

            {/* ACTIONS */}
            <div className="form-actions">
              {downloadDone ? (
                <>
                  <div className="success-banner">
                    🎉 Your flyer was downloaded successfully!
                  </div>
                  <button type="submit" className="btn btn--primary btn--lg" disabled={isGenerating}>
                    {isGenerating ? <><span className="spinner" /> Generating…</> : '⬇ Download Again'}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  id="generate-btn"
                  className="btn btn--primary btn--lg"
                  disabled={isGenerating || !photo}
                  title={!photo ? 'Please upload a photo first' : ''}
                >
                  {isGenerating ? (
                    <><span className="spinner" /> Generating your flyer…</>
                  ) : (
                    '⬇ Generate & Download Flyer'
                  )}
                </button>
              )}

              <button
                type="button"
                id="reset-btn"
                className="btn btn--ghost"
                onClick={handleReset}
              >
                🔄 Fill for Someone Else
              </button>
            </div>
          </form>
        </main>

        {/* ── PREVIEW (desktop sidebar / mobile toggle) ── */}
        {isDesktop ? (
          <Preview
            data={debouncedValues}
            isExpanded={true}
            onToggle={() => { }}
          />
        ) : (
          <Preview
            data={debouncedValues}
            isExpanded={previewExpanded}
            onToggle={() => setPreviewExpanded((p) => !p)}
          />
        )}
      </div>

      {/* ── CAPTURE TARGET (Hidden DOM Node) ── */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <FlyerTemplate data={debouncedValues} ref={captureRef} />
      </div>
    </div>
  );
}
