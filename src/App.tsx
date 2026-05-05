import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PhotoUpload } from './components/PhotoUpload/PhotoUpload';
import { Preview } from './components/Preview/Preview';
import { useDebounce } from './hooks/useDebounce';
import { generateAndDownload } from './lib/generateFlyer';
import { FlyerTemplate } from './components/FlyerTemplate/FlyerTemplate';
import { LEVEL_OPTIONS, NIGERIA_STATES, type FlyerData } from './types/FlyerData';

const MAX_CHARS: Record<string, number> = {
  firstName: 20,
  surname: 20,
  stateOfOrigin: 20,
  favouriteQuote: 120,
  socialHandle: 20,
  hobbies: 20,
  bestCourse: 20,
  bestLecturer: 20,
  favouriteCourseMate: 20,
  ifNotSoftware: 20,
  bestExperienceInAuchi: 100,
  worstExperienceInAuchi: 100,
};

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  const near = len >= max - 5;
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
  const [photo, setPhoto] = useState(() => localStorage.getItem('fyb_photo') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(window.innerWidth >= 900);
  
  const captureRef = useRef<HTMLDivElement>(null);
  const {
    register, handleSubmit, watch, reset, control,
    formState: { errors },
  } = useForm<FlyerData>({ 
    mode: 'onBlur',
    defaultValues: JSON.parse(localStorage.getItem('fyb_formData') || '{}')
  });

  const watchedValues = watch();
  const debouncedValues = useDebounce({ ...watchedValues, photo }, 800);

  // Persist form data to localStorage
  useEffect(() => {
    localStorage.setItem('fyb_formData', JSON.stringify(watchedValues));
  }, [watchedValues]);

  // Persist photo to localStorage
  useEffect(() => {
    localStorage.setItem('fyb_photo', photo);
  }, [photo]);

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
    localStorage.removeItem('fyb_formData');
    localStorage.removeItem('fyb_photo');
    reset({
      firstName: '',
      surname: '',
      dateOfBirth: '',
      stateOfOrigin: '',
      favouriteQuote: '',
      socialHandle: '',
      hobbies: '',
      bestCourse: '',
      bestLecturer: '',
      bestLevel: '',
      worstLevel: '',
      favouriteCourseMate: '',
      ifNotSoftware: '',
      bestExperienceInAuchi: '',
      worstExperienceInAuchi: '',
    });
    setPhoto('');
    setDownloadDone(false);
  }, [reset]);

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

              <div className="field-row">
                <div className="field" id="field-firstName">
                  <label className="field__label" htmlFor="firstName">
                    First Name <span className="field__required">*</span>
                  </label>
                  <div className="field__input-row">
                    <input
                      id="firstName"
                      className={`input${errors.firstName ? ' input--error' : ''}`}
                      placeholder="Michael"
                      {...register('firstName', {
                        required: 'Required',
                        maxLength: { value: 20, message: 'Max 20' },
                      })}
                    />
                    <CharCounter value={watchedValues.firstName} max={MAX_CHARS.firstName} />
                  </div>
                  <FieldError message={errors.firstName?.message} />
                </div>

                <div className="field" id="field-surname">
                  <label className="field__label" htmlFor="surname">
                    Surname <span className="field__required">*</span>
                  </label>
                  <div className="field__input-row">
                    <input
                      id="surname"
                      className={`input${errors.surname ? ' input--error' : ''}`}
                      placeholder="Ehigie"
                      {...register('surname', {
                        required: 'Required',
                        maxLength: { value: 20, message: 'Max 20' },
                      })}
                    />
                    <CharCounter value={watchedValues.surname} max={MAX_CHARS.surname} />
                  </div>
                  <FieldError message={errors.surname?.message} />
                </div>
              </div>

              <div className="field" id="field-dateOfBirth">
                <label className="field__label">
                  Birthday <span className="field__required">*</span>
                </label>
                <div className="field-row">
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    rules={{ required: 'Required' }}
                    render={({ field }) => {
                      const [month, day] = (field.value || '').split('-');
                      return (
                        <div className="field__input-row" style={{ gap: '0.5rem' }}>
                          <select
                            className="input select"
                            value={month || ''}
                            onChange={(e) => field.onChange(`${e.target.value}-${day || ''}`)}
                          >
                            <option value="">Month</option>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            className="input select"
                            value={day || ''}
                            onChange={(e) => field.onChange(`${month || ''}-${e.target.value}`)}
                          >
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                              <option key={d} value={d.toString().padStart(2, '0')}>{d}</option>
                            ))}
                          </select>
                        </div>
                      );
                    }}
                  />
                </div>
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
                    placeholder="Your favourite quote..."
                    {...register('favouriteQuote', {
                      required: 'Favourite quote is required',
                      maxLength: { value: 120, message: 'Max 120' },
                    })}
                  />
                  <CharCounter value={watchedValues.favouriteQuote} max={MAX_CHARS.favouriteQuote} />
                </div>
                <FieldError message={errors.favouriteQuote?.message} />
              </div>

              <div className="field" id="field-socialHandle">
                <label className="field__label" htmlFor="socialHandle">
                  Social Media Handle <span className="field__required">*</span>
                </label>
                <div className="field__input-row">
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">@</span>
                    <input
                      id="socialHandle"
                      className={`input input--prefixed${errors.socialHandle ? ' input--error' : ''}`}
                      placeholder="username"
                      {...register('socialHandle', {
                        required: 'Required',
                        maxLength: { value: 20, message: 'Max 20' },
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/^@+/, '');
                        },
                      })}
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
                { id: 'hobbies', label: 'Hobbies', max: 20, placeholder: 'e.g. Coding, Music' },
                { id: 'bestCourse', label: 'Best Course', max: 20, placeholder: 'e.g. Data Structures' },
                { id: 'bestLecturer', label: 'Best Lecturer', max: 20, placeholder: 'e.g. Mr. Adekunle' },
                { id: 'favouriteCourseMate', label: 'Favourite Course Mate', max: 20, placeholder: 'e.g. Chioma Obi' },
                { id: 'ifNotSoftware', label: 'If Not Software, What?', max: 20, placeholder: 'e.g. Architect' },
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
                        maxLength: { value: max, message: `Max ${max}` },
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
                        maxLength: { value: max, message: `Max ${max}` },
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

      {/* ── FLOATING SAVE BUTTON ── */}
      <SaveButton watchedValues={watchedValues} photo={photo} />
    </div>
  );
}

function SaveButton({ watchedValues, photo }: { watchedValues: any; photo: string }) {
  const [showSaved, setShowSaved] = useState(false);

  const handleManualSave = () => {
    localStorage.setItem('fyb_formData', JSON.stringify(watchedValues));
    localStorage.setItem('fyb_photo', photo);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <button 
      type="button" 
      className={`floating-save ${showSaved ? 'floating-save--success' : ''}`}
      onClick={handleManualSave}
    >
      {showSaved ? (
        <>✅ Saved!</>
      ) : (
        <>💾 Save Draft</>
      )}
    </button>
  );
}
